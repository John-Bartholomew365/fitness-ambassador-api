const mongoose = require("mongoose");


const BookSession = new mongoose.Schema({
  fullName: String,
  email: String,
  subject: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model("BookSession", BookSession);