const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;

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

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });
const userScheme = new Schema({
  login: String,
  password: String,
  email: String,
  role: String
})

const postScheme = new Schema({
  header: String,
  subject: String,
  text: String,
  tags: Array
  // comments: [
  //   idUser:  ,

  // ]
})

const userModel = mongoose.model("User", userScheme);
const postModel = mongoose.model("Post", postScheme);

mongoose.connect("mongodb://blog:qwerty123@ds241664.mlab.com:41664/blog", {useNewUrlParser: true})


app.configure

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  next();
})

const users = [
  {
    login: 'lol',
    password: '12345',
    email: 'qwer@gmail.com'
  }
];

app.get('/', (req, res) => {
  res.render('index');
  console.log(users);
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
// app.get('/', (req, res) => {
//   console.log(req.session)
//   res.render('index');
// })


app.get('/src/dist/bundle.js', (req, res) => {
  res.sendFile(__dirname + '/dist/bundle.js');
})
app.get('/src/dist/bundle.js.map', (req, res) => {
app.post('/authentication', (req, res) => {
  console.log("Авторизация открылась");
  console.log(req.body);
  // users.forEach(user => {
  // // if ((req.body.login == user.login) && (req.body.password == user.password)){
  // //   console.log("Авторизован");
  // // }


  // });
  mongoClient.connect(function(err, client){
    const db = client.db("blog");
    const collection = db.collection("Users");
    let user = {login: req.body.login,
                password: req.body.password};
    if (err) return console.log(err);
    collection.find().toArray(function(err, results){
      // console.log(findUser);
      console.log(results);
      client.close();
      results.forEach(user => {
        if ((user.name == req.body.login) && (user.password == req.body.password)){
          console.log("OK");
          res.send({signed: true});
        }
        else{
          res.send({signed: false})
        }

      });
    })

  })

  userModel.find({login: req.body.login,
             password: req.body.password}, function(err,docs){
               mongoose.disconnect();
               if (err) return console.log(err)
               req.session.authorized=true;  
              req.session.username=req.body.login;
               res.send({signed:true})
               console.log(docs)
             })
             
             console.log(req.session);
   
})

app.post('/registration', (req, res) => {
  console.log(req.body);
  mongoClient.connect(function(err, client){
    const db = client.db("blog");
    const collection = db.collection("Users");
    let user = {name: req.body.login,
                password: req.body.password,
                email: req.body.email};
    collection.insertOne(user, function(err, result){
        if(err){
            return console.log(err);
        }
        console.log(result.ops);
        client.close();
    });
  });
  console.log(users);
  const User = new userModel({
    login: req.body.login,
    password: req.body.password,
    email: req.body.email,
    role: "user"
 })
  User.save(function(err){
    mongoose.disconnect();

    if (err) console.log(err)
    console.log("Объект сохранен", User);
  })
  res.redirect('/');
})

app.post('/addPost', (req, res) => {
  const Post = new postModel({
    header: req.body.header,
    subject: req.body.subject,
    tags: req.body.tags
  })
  Post.save(function(err){
    mongoose.disconnect();

    if (err) console.log(err)
    console.log("Объект сохранен", Post);
  })
})


app.get('/getPosts', (req, res) => {
  // res.send(posts);
  console.log(db.Post);
  postModel.find( {},function(err,docs){
      mongoose.disconnect();
      if (err) return console.log(err)
      res.send(Post);
      console.log(Post)
    })
})

app.get('/*', (req, res) => {  // Чекать сессию тут нужно, ибо при прямом запросе автаризация на клиенте скипается
  res.render('index.ejs');
})
app.listen(process.env.PORT || 3000, () => {
  console.log('Сервер запущен');
})
})