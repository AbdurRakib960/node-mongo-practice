const express = require('express');
const bodyParser= require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;



const uri = "mongodb+srv://Rakib:yNXwq4SwmRRSPim@cluster0.tjyel.mongodb.net/myOrganicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html')
})




client.connect(err => {
  const productCollection = client.db("myOrganicdb").collection("myProducts");

  app.get('/product', (req,res) => {
      productCollection.find({})
      .toArray( (err, document) =>{
          res.send(document)
      } )
  })


  app.get('/productUpdate/:id', (req,res) => {
      productCollection.find({_id: ObjectId(req.params.id)})
      .toArray( (err, document) => {
          res.send(document[0])
      })
  })
  

  app.post("/addProduct", (req,res) => {
      const product = req.body;
      productCollection.insertOne(product)
      .then(result => {
          console.log('data added successfully')
          res.redirect('/')
      })
  })

  app.patch('/update/:id', (req,res) => {
      productCollection.updateOne({_id: ObjectId(req.params.id)},
      {
        $set: {price: req.body.price, quantity:req.body.quantity}
      })

    
    .then(result => {
        res.send(result.modifiedCount > 0)
    })
      
  })

  app.delete('/delete/:id', (req,res) =>{
      productCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
          res.send(result.deletedCount > 0)
      })
  })

  })
  
 
  




app.listen(3000)