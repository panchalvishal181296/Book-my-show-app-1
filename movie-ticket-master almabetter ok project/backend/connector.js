const dotenv = require("dotenv");
dotenv.config();

const mongoURI = process.env.MONGOURI;

const mongoose = require("mongoose");

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connection established with mongodb server online");
  })
  .catch((err) => {
    console.log("error while connection", err);
  });

module.exports = mongoose.connection;
