const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;

const app = express();

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });



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
    email: 'qwer@gmail.com'
  }
];

app.get('/', (req, res) => {
  res.render('index');
  console.log(users);
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
  res.redirect('/');
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Сервер запущен');
})
