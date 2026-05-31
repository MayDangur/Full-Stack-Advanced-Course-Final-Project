const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/taxwise")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });
// Test Route
app.get("/", (req, res) => {
  res.send("TaxWise Server Works!");
});
app.listen(5000, () => {
  console.log("Server started on port 5000");
});