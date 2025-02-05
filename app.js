require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postRoutes = require("./routes/postRoutes");
const cloudinary = require("./config/CloudinaryConfig");
const fileUpload = require("express-fileupload");

const hostname = "localhost";
const port = 8080;

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
// Middleware
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET , POST , PUT , DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type , Authorization");
  next();
});

app.use("/", postRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to database");
    app.listen(port, hostname, () => {
      console.log(`Server is running at http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
