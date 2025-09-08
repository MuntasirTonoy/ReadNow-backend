require("dotenv").config();
const express = require("express");
const cors = require("cors");

require("dotenv").config({ path: ".env.local" });
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// mongoDB connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oeq8sgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const db = client.db("readNowDB");
    const booksCollection = db.collection("books");

  //browse page er jonno books pawar api
    app.get("/books", async (req, res) => {
      const books = await booksCollection.find().toArray();
      res.send(books);
    });
  
    // specific book details
app.get("/books/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const book = await booksCollection.findOne({ _id: new ObjectId(id) });
    if (!book) {
      return res.status(404).send({ message: "Book not found!" });
    }
    res.send(book);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server Error" });
  }
});

     app.post("/books", async (req, res) => {
      const newBook = req.body;
      const result = await booksCollection.insertOne(newBook);
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("Hello server");
});

app.listen(port, () => {
  console.log(`server connected on port : ${port}`);
});
