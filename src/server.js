
const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const app = express();
const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);\
var MongoDBStore = require('connect-mongodb-session')(session);
var numExpectedSources = 2;
var store = new MongoDBStore({
  uri:  "mongodb://blog:qwerty123@ds241664.mlab.com:41664/blog",
  databaseName: 'blog',
  collection: 'mySessions'
})
store.on('error', function(err){
  if (err) console.log(err)
})

const userScheme = new Schema({
  login: String,
  password: String,
  email: String
})

const userModel = mongoose.model("User", userScheme);

mongoose.connect("mongodb://blog:qwerty123@ds241664.mlab.com:41664/blog", {useNewUrlParser: true})


app.configure

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
})

app.use(session({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));
// app.use(session({
//   secret:"Cat",
//   saveUninitialized: true,
//   resave: true,
//   store: new MongoStore({ 
//     url: "mongodb://blog:qwerty123@ds241664.mlab.com:41664/blog",
//     touchAfter: 24*3600 })
  
// }));




app.get('/', (req, res) => {
  res.render('index');
  // console.log(users);
  // req.session.message="Hello world"
  
})
app.get('/src/dist/bundle.js', (req, res) => {
  res.sendFile(__dirname + '/dist/bundle.js');
})
app.get('/src/dist/bundle.js.map', (req, res) => {
  res.sendFile(__dirname + '/dist/bundle.js.map');
})

app.post('/authentication', (req, res) => {
  console.log("Авторизация открылась");
  console.log(req.body);
  userModel.find({login: req.body.login,
             password: req.body.password}, function(err,docs){
               mongoose.disconnect();
               if (err) return console.log(err)
               res.send({signed:true})
               console.log(docs)
             })
  console.log(session);           
})
app.post('/registration', (req, res) => {
  console.log(req.body);
  const User = new userModel({
    login: req.body.login,
    password: req.body.password,
    email: req.body.email
 })
  User.save(function(err){
    mongoose.disconnect();

    if (err) console.log(err)
    console.log("Объект сохранен", User);
  })
  res.redirect('/');
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Сервер запущен');
})
