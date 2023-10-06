const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const router = express.Router();

const positionsUrl =
  "https://dev6.dansmultipro.com/api/recruitment/positions.json";

const positionDetailUrl =
  "https://dev6.dansmultipro.com/api/recruitment/positions";

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token not provided" });
  }

  jwt.verify(token.split(" ")[1], "secretKey", (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

router.get("/", verifyToken, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const response = await axios.get(`${positionsUrl}?page=${page}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/search", verifyToken, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const { description, location, full_time } = req.query;
    const params = new URLSearchParams({
      description,
      location,
      full_time,
      page,
    });
    const response = await axios.get(`${positionsUrl}?${params}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const response = await axios.get(`${positionDetailUrl}/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
