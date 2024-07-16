require("dotenv").config();
const mongoose = require("mongoose");
const connecteDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("connected to mongodb"))
    .catch((err) => console.log(err));  
};

module.exports = connecteDB;