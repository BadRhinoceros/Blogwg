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
  },
  {
    id: 2,
    header: 'Ну а это уже второй пост',
    content: 'Ну и его контент',
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
  const user = { name: name, password: password, email: email };

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
  collection.find({name : name,
                    password: password
                  }, function (err) {
                    if (err) console.log(err)
                    req.session.username=name
                    req.session.authorized=true
                  })
                    // .toArray((err, results) => {
    // if (err) return console.log(err);
    // results.forEach((item) => {
    //   if ((item.name == name) && (item.password == password)) {
    //     req.session.username = name;
    //     req.session.authorized = true;
    //   } else {
    //     req.session.authorized = false;
    //   }


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
/*const express = require('express')
const bodyParser = require('body-parser');

const app = express();

const users = [ // Это типо в базе данных
  {
    login: 'lol',
    password: '12345',
  },
  {
    login: 1,
    password: 1,
  }
];

const posts = [ // Это типо в базе данных
  {
    id: 1,
    header: 'Это первый пост',
    content: 'Это контент первого поста',
  },
  {
    id: 2,
    header: 'Ну а это уже второй пост',
    content: 'Ну и его контент',
  },
];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
})

app.get('/src/dist/bundle.js', (req, res) => {
  res.sendFile(__dirname + '/dist/bundle.js');
})
app.get('/src/dist/bundle.js.map', (req, res) => {
  res.sendFile(__dirname + '/dist/bundle.js.map');
})

app.post('/authentication', (req, res) => {
  console.log(req.body);
  users.forEach((user) => {
    if ((req.body.login == user.login) && (req.body.password == user.password)) {
      console.log('Авторизован');
      res.send({signed: true});
    }
  })
})

app.post('/registration', (req, res) => {
  console.log(req.body);
  console.log(`${req.body.login} ${req.body.password}`);
  let newUser = {
    login: req.body.login,
    password: req.body.password,
  }
  console.log(newUser);
  users.push(newUser);
  console.log(users);
  res.redirect('/');
})

app.get(/getPostById*//*, (req, res) => {
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

app.get('/*', (req, res) => {
  res.render('index.ejs');
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Сервер запущен');
})*/
