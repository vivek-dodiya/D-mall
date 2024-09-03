const mongoose = require("mongoose");
const config = require("config");
const debugr = require("debug")("development:mongoose");

const connect = mongoose
  .connect(`${config.get("MONGOOSE_URL")}/D-mall-APP`)
  .then(() => {
    debugr("Connected to MongoDB");
  })
  .catch((err) => {
    debugr("Error while connecting to MongoDB", err);
  });
  
module.exports = connect;

// "mongodb://127.0.0.1:27017/BAG-SHOP-APP"
