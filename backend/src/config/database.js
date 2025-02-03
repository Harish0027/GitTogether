const mongoose = require("mongoose");

const MongoDbSecreteKey =
  process.env.MongoDbSecreteKey || "mongodb://localhost:27017/gitTogether";

const connectToMongoDb = async () => {
  try {
    await mongoose.connect(MongoDbSecreteKey);
    console.log("MongoDb Connected Successfully!!!!");
  } catch (error) {
    throw new Error("Failed to Connect MongoDb");
  }
};

module.exports = connectToMongoDb;
