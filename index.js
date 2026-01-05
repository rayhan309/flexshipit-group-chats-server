const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const server = createServer(app);

// const port =process.env.PORT || 48000;

// middlewer
app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const uri = process.env.DB_uri;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("sendMessage", (message) => {
        io.emit("receiveMessage", message);
      });

      // socket.on("disconnect", () => {
      //   console.log("User disconnected:", socket.id);
      // });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("This server is running!");
});

server.listen(4800, () => {
  console.log(`Example app listening on port ${4800}`);
});
