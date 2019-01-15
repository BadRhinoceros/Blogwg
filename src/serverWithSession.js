const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true });

const app = express();
let dbClient;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
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

app.post(/sign/, (req, res) => {
  const { name,password } = req.query;
  const user = { name: name, password: password };

  const collection = req.app.locals.collection;
  collection.insertOne(user, (err, result) => {
    if (err) return console.log(err);
    console.log(result.ops);
    res.render('index.ejs');
  });
});

app.post(/login/, (req, res) => {
  const { name,password } = req.query;
  console.log(name);
  const collection = req.app.locals.collection;
  collection.find().toArray((err, results) => {
    if (err) return console.log(err);
    results.forEach((item) => {
      if ((item.name == name) && (item.password == password)) {
        req.session.authorized = true;
        req.session.username = name;
      } else {
        req.session.authorized = false;
      }
    });

    if (req.session.authorized) {
      res.send({ authorized: true, profileName: req.session.username});
    } else {
      res.send({ authorized: false });
    }

    console.log(req.session);
  });
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

app.get('/', (req, res) => {
  res.render('index.ejs');
});

process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
