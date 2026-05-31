const express = require("express");
const mongoose = require("mongoose");
const postRoutes = require("./routes/post_routes");
const routes = require("./routes");
const app = express();
app.use(express.json());
app.use("/", routes);
app.use("/post", postRoutes);
// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/taxwise")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(5000, () => {
  console.log("Server started on port 5000");
});