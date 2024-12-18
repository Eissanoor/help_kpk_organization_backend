const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
var DATABASE = process.env.DATABASE;
const MONGODB_URL = DATABASE;
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((e) => {
    console.error("Database connection error:", e);
  });
