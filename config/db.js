const mongeese = require("mongoose");
const asynchandler = require("express-async-handler");
require("dotenv").config();

const connectDb = asynchandler(async () => {
  const connect = await mongeese.connect(process.env.MONGODB_URI);
  console.log(`DB Connected: ${connect.connection.host}`);
});

module.exports = connectDb;