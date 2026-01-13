const mongoose = require("mongoose");

module.exports = mongoose.model("Order", new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: Array,
    totalAmount: Number,
    status: { type: String, default: "pending" }
}, { timestamps: true }));
