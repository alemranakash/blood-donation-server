const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

//* Middleware

app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ftdzayi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("bloodDB").collection("users");
    const bloodRequestCollection = client.db("bloodDB").collection("bloodRequest");



// *user related apis
app.post('/users', async (req, res) => {
  const item = req.body;
  const result = await userCollection.insertOne(item);
  res.send(result);
});

app.get('/users', async (req, res) => {
  const result = await userCollection.find().toArray();
  res.send(result);
});

app.get('/dashboard/profile/updateUser/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await userCollection.findOne(query)
  res.send(result)
})


app.patch('/dashboard/profile/updateUser/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const options = { upsert: true }
  const updatedUserData = req.body;
  const user = {
    $set:{
      name: updatedUserData.name, 
      photoUrl: updatedUserData.photoUrl, 
      bloodGroup: updatedUserData.bloodGroup, 
      district: updatedUserData.district, 
      upazila: updatedUserData.upazila
    }
  }
  const result = await userCollection.updateOne(filter, user, options)
  res.send(result)
})

// * blood request 
app.post('/bloodRequest', async (req, res) => {
  const item = req.body;
  const result = await bloodRequestCollection.insertOne(item);
  res.send(result);
});

app.get('/bloodRequest', async (req, res) => {
  const result = await bloodRequestCollection.find().toArray();
  res.send(result);
});

app.delete('/bloodRequest/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await bloodRequestCollection.deleteOne(query);
  res.send(result);
})

// * donation done
app.patch('/bloodRequest/done/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: {
      donationStatus: 'done'
    }
  }
  const result = await bloodRequestCollection.updateOne(filter, updatedDoc);
  res.send(result);
})

// *donation cancellation
app.patch('/bloodRequest/cancel/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: {
      donationStatus: 'canceled'
    }
  }
  const result = await bloodRequestCollection.updateOne(filter, updatedDoc);
  res.send(result);
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





//to check server is running

app.get('/', (req, res) => {
    res.send('server is running');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})