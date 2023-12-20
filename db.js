const mongoose = require("mongoose");

const uri =
  "mongodb+srv://shivamt2023:ft123shivam123@cluster0.kqsexaf.mongodb.net/test?retryWrites=true&w=majority";

const MongoDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB Atlas");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Disconnected from MongoDB Atlas");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
  }
};

module.exports = MongoDB;

// Call MongoDB() to execute the code
MongoDB();
