const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');

const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true });
const app = express();
let dbClient;

/*const posts = [ // Это типо в базе данных
  {
    id: 1,
    header: 'Это первый пост',
    content: 'Это контент первого поста',
    tags: ['это','просто','теги','ага'],
  },
  {
    id: 2,
    header: 'Ну а это уже второй пост',
    content: 'Ну и его контент',
    tags: ['это','просто','теги','ага'],
  },
];*/

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

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

app.post('/deletePost', (req, res) => {
 console.log(req.body.postId);
 if(req.body.postId) {
   let postId = req.body.postId;
   const collection = app.locals.postsCollection;
   collection.deleteOne({_id: new mongo.ObjectId(postId)}).then(result => {
          console.log(result);
         return result;
      });;

   collection.find().toArray((err, result) => {
     console.log(result);
   })
   console.log('Что-то произошло?');
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
  }
  const collection = req.app.locals.postsCollection;
  collection.insertOne(post, (err, result) => {
    if (err) return console.log(err);
    console.log(result.ops);
    console.log('Пост добавлен');
    res.render('index.ejs');
  });
  res.render('index.ejs');
});

app.get(/getPostById*/, (req, res) => {
  /*if(req.query.id) {
    let postId = req.query.id;
    console.log(`ID поста = ${postId}`);
    let post;

    posts.forEach((item) => {
      if(postId == item.id) {
        post = item;
      }
    })

    if (post) {
      res.send(post);
    } else {
      res.send({ notFound: true});
    }

  } else {
    console.log("Неправильный Id");
    res.redirect('/');
  }*/
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
            tags: [item.tags],
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
        tags: [item.tags],
      }
      posts.push(post);
      //console.log(posts);
    });
    res.send(posts);
  })
  //res.send(posts);
})

app.post(/sign/, (req, res) => { // Переделать в body
  const { name,password,email } = req.query;
  const user = { name: name, password: password, email: email, role: 'user' };

  const collection = req.app.locals.collection;
  collection.insertOne(user, (err, result) => {
    if (err) return console.log(err);
    //console.log(result.ops);
    console.log('Пользователь добавлен');
    res.render('index.ejs');
  });
});

app.post(/login/, (req, res) => { // Переделать в body
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
        let userRole = result[0].role;
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
  res.send({ authorized: false });
})

app.get('/*', (req, res) => {
  res.render('index.ejs');
});

process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
