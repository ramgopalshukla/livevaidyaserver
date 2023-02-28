const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(`Mongodb Server Issue ${error}`.bgRed.white);
  }
};

module.exports = connectDB;
