const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
// !>>>>>> Stripe 1 >>>>>>>
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// !<<<<<<<<<<<<<<<<<<<<<<<
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
    const blogCollection = client.db("bloodDB").collection("blogs");
      // !>>>>>> Stripe 3 >>>>>>>
      const paymentCollection = client.db("bloodDB").collection("payments");
      // !<<<<<<<<<<<<<<<<<<<<<<<



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
      // photoUrl: updatedUserData.photoUrl, 
      bloodGroup: updatedUserData.bloodGroup, 
      district: updatedUserData.district, 
      upazila: updatedUserData.upazila
    }
  }
  const result = await userCollection.updateOne(filter, user, options)
  res.send(result)
})

// * All users actions
// ! Block
app.patch('/allUsers/block/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: {
      status: 'block'
    }
  }
  const result = await userCollection.updateOne(filter, updatedDoc);
  res.send(result);
})

// ! Unblock
app.patch('/allUsers/unBlock/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: {
      status: 'active'
    }
  }
  const result = await userCollection.updateOne(filter, updatedDoc);
  res.send(result);
})

// ! Make Volunteer
app.patch('/allUsers/makeVolunteer/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: {
      role: 'volunteer'
    }
  }
  const result = await userCollection.updateOne(filter, updatedDoc);
  res.send(result);
})

// ! Make Admin
app.patch('/allUsers/makeAdmin/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: {
      role: 'admin'
    }
  }
  const result = await userCollection.updateOne(filter, updatedDoc);
  res.send(result);
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


// * donate button on DonateDetails page
app.patch('/bloodRequest/donate/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const { donorName, donorEmail } = req.body.donorInfo;
  const updatedDoc = {
    $set: {
      donationStatus: 'inprogress',
      donorName: donorName, 
      donorEmail: donorEmail
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

// * update blood donation request
app.patch('/dashboard/donorDashboard/editBloodRequest/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const options = { upsert: true }
  const updatedBloodRequest = req.body;
  const bloodRequest = {
    $set:{
      recipientName: updatedBloodRequest.recipientName ,
      district: updatedBloodRequest.district ,
      bloodGroup: updatedBloodRequest.bloodGroup ,
      upazila: updatedBloodRequest.upazila , 
      hospitalName: updatedBloodRequest.hospitalName ,
      fullAddress: updatedBloodRequest.fullAddress ,
      donationDate: updatedBloodRequest.donationDate ,
      donationTime: updatedBloodRequest.donationTime ,
      requestMessage: updatedBloodRequest.requestMessage

    }
  }
  const result = await bloodRequestCollection.updateOne(filter, bloodRequest, options)
  res.send(result)
})


// * blog related apis
app.post('/blogs', async (req, res) => {
  const item = req.body;
  const result = await blogCollection.insertOne(item);
  res.send(result);
});

app.get('/blogs', async (req, res) => {
  const result = await blogCollection.find().toArray();
  res.send(result);
});

// ! Publish
app.patch('/blogs/publish/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: {
      blogStatus: 'published'
    }
  }
  const result = await blogCollection.updateOne(filter, updatedDoc);
  res.send(result);
})

// ! Unpublish
app.patch('/blogs/unPublish/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: {
      blogStatus: 'draft'
    }
  }
  const result = await blogCollection.updateOne(filter, updatedDoc);
  res.send(result);
})


// ! Delete a blog
app.delete('/blogs/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await blogCollection.deleteOne(query);
  res.send(result);
})


// * Payment intent
// !>>>>>> Stripe 2 >>>>>>>
app.post('/create-payment-intent', async (req, res) => {
  const { totalAmount } = req.body;
  const amount = parseInt(totalAmount * 100);
  // const amount = parseInt(Number(price) * 100);

  console.log(amount, 'amount inside the intent')

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    payment_method_types: ['card']
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  })
});
// !<<<<<<<<<<<<<<<<<<<<<<<

// !>>>>>> Stripe 4 >>>>>>>
app.post('/payments', async (req, res) => {
  const payment = req.body;
  const paymentResult = await paymentCollection.insertOne(payment);
  res.send(paymentResult);
})
// !<<<<<<<<<<<<<<<<<<<<<<<

// !>>>>>> Stripe 5 >>>>>>>
app.get('/payments', async (req, res) => {
  const result = await paymentCollection.find().toArray();
  res.send(result);
});
// !<<<<<<<<<<<<<<<<<<<<<<<


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