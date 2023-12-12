require("dotenv").config({ path: "../.env" });
const { MongoClient } = require("mongodb");
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://yesj1234:${MONGODB_PASSWORD}@cluster0.wmwqk54.mongodb.net/?retryWrites=true&w=majority`;
module.exports = function (callback) {
  return MongoClient.connect(uri, callback);
};
