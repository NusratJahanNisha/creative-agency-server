const express = require('express')
const app = express()
const port = 9000
const bodyParser = require('body-parser')
const cors = require("cors");
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
require('dotenv').config()



app.use(cors());
app.use(bodyParser.json());
app.use(express.static('serviceImage'));
app.use(fileUpload());


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nusrat:nisha005@cluster0.pgiio.mongodb.net/agency?retryWrites=true&w=majority";
// const uri = "mongodb+srv://${process.env.DB_User}:{$process.env.DB_PASS}@cluster0.pgiio.mongodb.net/{$process.env.DB_NAME}?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const reviewCollection = client.db("agency").collection("reviews");
  const adminCollection = client.db("agency").collection("admin");
  const userCollection = client.db("agency").collection("user");
  const serviceCollection = client.db("agency").collection("service");

  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
      .then(result => { res.send(result.insertedCount > 0) })
    console.log(req.body)
    console.log(err);
  })

  app.post('/addUserDetails', (req, res) => {
    const newUser = req.body;
    userCollection.insertOne(newUser)
      .then(result => { res.send(result.insertedCount > 0) })
    console.log(req.body)
    console.log(err);
  })

  app.post('/addService', (req, res) => {
    const newService = req.body;
    serviceCollection.insertOne(newService)
      .then(result => { res.send(result.insertedCount > 0) })
    console.log(req.body)
    console.log(err);
  })

  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin)
      .then(result => { res.send(result.insertedCount > 0) })
    console.log(req.body)
    console.log(err);
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, email) => {
        res.send(email.length > 0)
        console.log(err)
      })
  })



  app.get('/adminServiceList', (req, res) => {
    userCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  app.get('/userServiceList', (req, res) => {
    userCollection.find({ userEmail: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/reviewAll', (req, res) => {
    reviewCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.get('/service', (req, res) => {
    serviceCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});




  app.post('/addAService', (req, res) => {

    const file = req.files.file;
    const name = req.body.name;
    const description = req.body.description;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    serviceCollection.insertOne({ name, description, image })
      .then(result => {
        res.send(result.insertedCount > 0);
      })

  })


});


app.listen(process.env.PORT || port)