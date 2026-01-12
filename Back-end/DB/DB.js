const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Succesfully connected to the database");
  } catch (error) {
    console.log(error);
    console.error("Could not connect to the database");
  }
}

module.exports = connectDB;
