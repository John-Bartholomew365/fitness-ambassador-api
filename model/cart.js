const mongoose = require("mongoose");

module.exports = mongoose.model("Cart", new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [{
        wearId: { type: mongoose.Schema.Types.ObjectId, ref: "GymWear" },
        size: String,
        quantity: Number
    }]
}));
