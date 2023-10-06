const express = require("express");
const bodyParser = require("body-parser");
const jobsRoutes = require("./routes/jobs");
const cors = require("cors");

const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; // URI for the MongoDB server
const dbName = "job_portal"; // Name of the MongoDB database

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }
  console.log("Connected to MongoDB");

  const db = client.db(dbName);

  // Set up routes and other application logic here
});

const app = express();
const db = client.db(dbName);
const authRoutes = require("./routes/auth")(db);

app.use(cors());
app.use(bodyParser.json());
// Pass the MongoDB connection to your routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
