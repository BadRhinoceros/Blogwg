const express = require('express')
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

app.get('/*', (req, res) => {  // Чекать сессию тут нужно, ибо при прямом запросе автаризация на клиенте скипается
  res.render('index.ejs');
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Сервер запущен');
})
