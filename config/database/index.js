const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const dbConnection = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(
      process.env.NODE_ENV === "test"
        ? process.env.TEST_DATABSE_URL
        : process.env.DATABASE_URL,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("connected to database");
      mongoose.set("debug", true);
    })
    .catch((err) => {
      console.log("can't connect to database", err);
      process.exit(1);
    });
};
module.exports = dbConnection;
