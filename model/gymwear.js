const mongoose = require("mongoose");

module.exports = mongoose.model("GymWear", new mongoose.Schema({
    name: String,
    images: [String],
    sizes: [String],
    price: Number,
    stock: Number
}, { timestamps: true }));
