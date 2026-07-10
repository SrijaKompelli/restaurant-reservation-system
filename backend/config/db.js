const mongoose = require("mongoose");
require("dotenv").config();

const atlasUri = process.env.MONGO_URI;
const localUri = process.env.MONGO_LOCAL_URI || "mongodb://127.0.0.1:27017/restaurant-reservation";

const connectMongo = async () => {
  const candidates = [atlasUri, localUri].filter(Boolean);
  let lastError;

  for (const uri of candidates) {
    try {
      console.log("Connecting to MongoDB using:", uri.startsWith("mongodb+srv") ? "Atlas SRV URI" : uri);
      await mongoose.connect(uri);
      console.log("MongoDB Connected");
      return;
    } catch (err) {
      lastError = err;
      console.error(`MongoDB connection failed for ${uri}:`, err.message || err);
      if (uri === atlasUri && atlasUri?.includes("+srv")) {
        console.error("Atlas SRV DNS lookup failed. Trying local MongoDB fallback if available.");
      }
    }
  }

  throw lastError || new Error("No MongoDB connection could be established");
};

module.exports = connectMongo;
