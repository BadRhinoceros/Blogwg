const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true });

const app = express();
let dbClient;

const posts = [ // Это типо в базе данных
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
];

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
  app.listen(process.env.PORT || 3000, () => {
    console.log('Сервер запущен');
  });
});

app.post('/createPost', (req, res) => {
  console.log(req.body);
  let post = {
    id: +new Date(),
    header: req.body.header,
    content: req.body.subject,
    tags: req.body.tags,
  }
  posts.push(post);
  res.render('index.ejs');
});

app.get(/getPostById*/, (req, res) => {
  if(req.query.id) {
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
  }
})

app.get('/getPosts', (req, res) => {
  res.send(posts);
})

app.post(/sign/, (req, res) => {
  const { name,password,email } = req.query;
  const user = { name: name, password: password, email: email, rule: 'user' };

  const collection = req.app.locals.collection;
  collection.insertOne(user, (err, result) => {
    if (err) return console.log(err);
    console.log(result.ops);
    console.log('Пользователь добавлен');
    res.render('index.ejs');
  });
});

app.post(/login/, (req, res) => {
  const { name,password } = req.query;
  console.log(name);
  const collection = req.app.locals.collection;
  collection.find({name : name, password: password}, (err) => {
    if (err) return console.log(err)
    req.session.username=name
    req.session.authorized=true
  })

    if (req.session.authorized) {
      res.send({ authorized: true, profileName: req.session.username});
    } else {
      res.send({ authorized: false });
    }

    console.log(req.session);
  });


app.get('/checkSession', (req, res) => {
  if (req.session.authorized) {
    res.send({ authorized: true, profileName: req.session.username});
  } else {
    res.send({ authorized: false });
  }
  console.log(req.session);
});

app.get('/logout', (req, res) => {
  delete req.session.authorized;
  delete req.session.username;
  res.send({ authorized: false });
})

app.get('/*', (req, res) => {
  res.render('index.ejs');
});

process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
