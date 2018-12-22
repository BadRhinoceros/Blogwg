const express = require('express')
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
})

const users = [
  {
    login: 'lol',
    password: '12345',
  },
  {
    login: 1,
    password: 1,
  }
];

app.get('/', (req, res) => {
  res.render('index');
})
app.get('/src/dist/bundle.js', (req, res) => {
  res.sendFile(__dirname + '/dist/bundle.js');
})
app.get('/src/dist/bundle.js.map', (req, res) => {
  res.sendFile(__dirname + '/dist/bundle.js.map');
})

app.post('/authorization', (req, res) => {
  console.log(req.body);
  users.forEach((user) => {
    if ((req.body.login == user.login) && (req.body.password == user.password)) {
      console.log('Авторизован');
      res.send({signed: true});
    }
  })
  res.redirect('/');
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

app.listen(process.env.PORT || 3000, () => {
  console.log('Сервер запущен');
})
