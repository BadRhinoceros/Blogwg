const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');

const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true });
const app = express();
let dbClient;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public/images'));

app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ url:'mongodb://localhost:27017/' }),
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/src/dist/bundle.js', (req, res) => {
  res.sendFile(__dirname + '/dist/bundle.js');
});
app.get('/src/dist/bundle.js.map', (req, res) => {
  res.sendFile(__dirname + '/dist/bundle.js.map');
});

mongoClient.connect((err, client) => {
  if (err) return console.log(err);
  dbClient = client;
  app.locals.collection = client.db('testblog').collection('users');
  app.locals.postsCollection = client.db('testblog').collection('posts');
  app.listen(process.env.PORT || 3000, () => {
    console.log('Сервер запущен');
  });
});

app.post('/fingPost', (req,res) => {
  if (req.body.postHeader) {
    const collection = app.locals.postsCollection;
    let posts = [];
    collection.find({header: req.body.postHeader}).toArray((err, result) => {
      if (err) return console.log(err);
      result.forEach((item) => {
        let post = {
          id: item._id,
          author: item.author,
          header: item.header,
          content: item.content,
          tags: item.tags,
        }
        posts.push(post);
      });
      res.send(posts);
    })
  }
})

app.post('/deleteLike', (req,res) => {
  let postId = req.body.postId;
  if (postId) {
    const collection = app.locals.postsCollection;
    collection.updateOne({_id: new mongo.ObjectId(postId)}, {$pull: { likes: new mongo.ObjectId(req.session.userId) }})
    res.send({isLiked: false});
  }
})

app.post('/addLike', (req,res) => {
  let postId = req.body.postId;
  if (postId) {
    const collection = app.locals.postsCollection;
    collection.updateOne({_id: new mongo.ObjectId(postId)}, {$push: { likes: new mongo.ObjectId(req.session.userId) }})
    res.send({isLiked: true});
  }
})

app.post('/getPostLikes', (req, res) => {
  let postId = req.body.postId;
  if (postId) {
    const collection = app.locals.postsCollection;
    collection.find({_id: new mongo.ObjectId(postId)}).toArray((err, result) => {
      if (err) return console.log(err);
      result.forEach((item) => {
        console.log(item.likes.length);
        res.send({numberOfLikes: item.likes.length});
      })
    })
  }
})

app.post('/checkLike', (req, res) => {
  let postId = req.body.postId;
  if (postId) {
    const collection = app.locals.postsCollection;
    collection.find({_id: new mongo.ObjectId(postId), likes: new mongo.ObjectId(req.session.userId)}).toArray((err, result) => {
      if (err) return console.log(err);
      if (result.length) {
        res.send(true);
      } else {
        res.send(false);
      }
    })
  }
})

app.post('/addComment', (req, res) => {
  const { postId,text } = req.body;
  if (postId && req.session.username) {
    console.log(`К посту с id:${postId} добавить комментарий с текстом:${text}`);
    const collection = app.locals.postsCollection;
    collection.updateOne({_id: new mongo.ObjectId(postId)}, {$push: { comments: {_id: new mongo.ObjectId(), name: req.session.username, text:text } }})
  }
  res.render('index');
})

app.post('/deletePost', (req, res) => {
 console.log(req.body.postId);
 if(req.body.postId) {
   let postId = req.body.postId;
   const collection = app.locals.postsCollection;
   collection.deleteOne({_id: new mongo.ObjectId(postId)})
    .then(result => {
        return result;
    })
 }
 res.render('index');
});

app.post('/createPost', (req, res) => {
  console.log(req.body);
  let post = {
    id: +new Date(),
    header: req.body.header,
    author: req.session.username,
    content: req.body.subject,
    tags: req.body.tags,
    likes: [],
    comments: [],
  }
  const collection = req.app.locals.postsCollection;
  collection.insertOne(post, (err, result) => {
    if (err) return console.log(err);
    console.log(result.ops);
    console.log('Пост добавлен');
    res.render('index');
  });
});

app.get(/getPostById*/, (req, res) => {
  if(req.query.id) {
    let postId = req.query.id;
    console.log(`ID поста = ${postId}`);
    const collection = app.locals.postsCollection;
    let post;

    collection.find().toArray((err, result) => {
      if (err) return console.log(err);

      result.forEach((item) => {
        if(postId == item._id) {
          post = {
            id: item._id,
            author: item.author,
            header: item.header,
            content: item.content,
            tags: item.tags,
            comments: item.comments,
          }
        }
      })
      if (post) {
        res.send(post);
      } else {
        res.send({ notFound: true });
      }
    })
    console.log(post);
  }
})

app.get('/getPosts', (req, res) => {
  const collection = app.locals.postsCollection;
  let posts = [];
  collection.find().toArray((err, result) => {
    if (err) return console.log(err);
    result.forEach((item) => {
      let post = {
        id: item._id,
        author: item.author,
        header: item.header,
        content: item.content,
        tags: item.tags,
      }
      posts.push(post);
    });
    res.send(posts);
  })
})

app.post(/sign/, (req, res) => {
  const { name,password,email } = req.query;
  const user = { name: name, password: password, email: email, role: 'user' };

  const collection = req.app.locals.collection;
  collection.insertOne(user, (err, result) => {
    if (err) return console.log(err);
    console.log('Пользователь добавлен');
    res.render('index.ejs');
  });
});

app.post(/login/, (req, res) => {
  const { name,password } = req.query;
  console.log(name);
  const collection = req.app.locals.collection;
  collection.find({name : name, password: password},{role: 1}, (err, result) => {
    if (err) return console.log(err);
    req.session.username = name;
    req.session.authorized = true;
  });

    if (req.session.authorized) {
      collection.find({name : name, password: password}).toArray((err, result) => {
        let userId = result[0]._id;
        let userRole = result[0].role;
        req.session.userId = userId;
        req.session.userRole = userRole;
        res.send({ authorized: true, profileName: req.session.username, userRole: req.session.userRole});
        console.log(req.session);
      });
    } else {
      res.send({ authorized: false });
    }
});

app.get('/checkSession', (req, res) => {
  if (req.session.authorized) {
    res.send({ authorized: true, profileName: req.session.username, userRole: req.session.userRole});
  } else {
    res.send({ authorized: false });
  }
  console.log(req.session);
});

app.get('/logout', (req, res) => {
  delete req.session.authorized;
  delete req.session.username;
  delete req.session.userRole;
  delete req.session.userId;
  res.send({ authorized: false });
})

app.get('/*', (req, res) => {
  res.render('index.ejs');
});

process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
