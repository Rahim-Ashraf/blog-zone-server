const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://blog-zone-8a6a4.web.app",
            "https://blog-zone-8a6a4.firebaseapp.com"
        ],
        credentials: true,
    })
);
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.ae5xaid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        const database = client.db("blog_zone");
        const blogs = database.collection("blogs");
        const wishlist = database.collection("wishlist");
        const comments = database.collection("comments");

        app.get("/recent-blogs", async (req, res) => {
            const result = await blogs.find().sort({ _id: -1 }).limit(6).toArray();
            res.send(result)
        })
        app.get("/all-blogs", async (req, res) => {
            const result = await blogs.find().toArray();
            res.send(result)
        })
        app.get("/blog-details/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await blogs.findOne(query);
            res.send(result)
        })
        app.post("/add-blog", async (req, res) => {
            const data = req.body;
            const result = await blogs.insertOne(data);
            res.send(result)
        })
        app.post("/add-wishlist", async (req, res) => {
            const data = req.body;
            const result = await wishlist.insertOne(data);
            res.send(result)
        })
        app.get("/wishlist", async (req, res) => {
            const email = req.query.email;
            const query = { wishlist_email: email };
            const result = await wishlist.find(query).toArray();
            res.send(result)
        })
        app.post("/add-comment", async (req, res) => {
            const comment = req.body;
            const result = await comments.insertOne(comment);
            res.send(result)
        })
        app.get("/comments", async (req, res) => {
            const id = req.query.id
            const query = { id: id };
            const result = await comments.find(query).toArray();
            res.send(result)
        })

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
    res.send("Blog zone is running")
})

app.listen(port)