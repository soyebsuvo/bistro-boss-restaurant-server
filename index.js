const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1qnjuxu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const menusCollection = client.db("bossDB").collection("menus");
    const reviewsCollection = client.db("bossDB").collection("reviews");
    const cartsCollection = client.db("bossDB").collection("carts");
    const usersCollection = client.db("bossDB").collection("users");

    // users related apis
    
    app.get("/users" , async (req , res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    })

    app.patch("/users/admin/:id" , async (req , res) => {
      const id = req.params.id;
      const filter = { _id : new ObjectId(id)};
      const updatedDoc = {
        $set:{
          role : "admin"
        }
      }
      const result = await usersCollection.updateOne(filter , updatedDoc);
      res.send(result)
    })

    app.delete("/users/:id" , async ( req , res ) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })

    app.post("/users" , async ( req , res ) => {
      const user = req.body;
      const query = { email : user.email};
      const isExistUser = await usersCollection.findOne(query);
      if(isExistUser){
        return res.send({message : 'Already exist'})
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    app.get("/menus", async (req, res) => {
      const result = await menusCollection.find().toArray();
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });

    app.get("/carts", async (req, res) => {
      const email = req?.query?.email;
      const query = { email: email };
      const result = await cartsCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/carts/:id" , async (req , res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      const result = await cartsCollection.deleteOne(query);
      res.send(result)
    })

    app.post("/carts", async (req, res) => {
      const cart = req.body;
      const result = await cartsCollection.insertOne(cart);
      res.send(result);
    });

    // await client.connect();
    // Connect the client to the server	(optional starting in v4.7)
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();/
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Bistro boss is running");
});

app.listen(port, () => {
  console.log(`bistro boss in running on port ${port}`);
});
