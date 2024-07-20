const mongoose = require("mongoose");
require("dotenv").config();


exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("db connection is successful"))
    .catch((error) => {
      console.log("db connection not successful");
      console.error(error.message);
      process.exit(1);
    });
}