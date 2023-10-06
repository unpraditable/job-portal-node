const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

module.exports = function (db) {
  // Define the users collection
  const usersCollection = db.collection("users");

  router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
      // Find the user in the database
      const user = await usersCollection.findOne({ username });

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return router;
};
