const express = require('express');

const app = express();

const cors = require('cors')

const bodyParser = require('body-parser');

const port = 4000;
const mongo = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";

const ObjectId = require('mongodb').ObjectId;

let db, caloriesItemsDb

mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db("calories")
  }
)

mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db("calories")
    caloriesItemsDb = db.collection("caloriesItems")
  }
)

const caloriesItems = [
    {day: "2022-01-01T23:28:56.782Z", numberOfCaloriesPerUnit: 1000, title: 'Brumik', unit: 'psc', count: 1},
    {day: "2022-01-01T23:28:56.782Z", numberOfCaloriesPerUnit: 2000, title: 'Bramburky', unit: 'psc', count: 1}
  ];

app.use(cors());  
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello world!');
})

app.get('/calorie-data', (req, res) => {
    caloriesItemsDb.find().toArray((err, items) => {
        res.json(items);
    });
    //res.json(caloriesItems);
})

app.delete('/calorie-data/:id', (req, res) =>{
    console.log('delete:' + req.params.id);
    caloriesItemsDb.deleteOne({"_id": ObjectId(req.params.id)});
    res.send('deleted');
})

app.post('/calorie-data', (req, res) => {
    const item = req.body;
    console.log('new item: ' + JSON.stringify(item));
    caloriesItems.push(item);
    caloriesItemsDb.insertOne(item, (err, result) => {});
    res.send('saved');
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})