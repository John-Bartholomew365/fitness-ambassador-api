const mongoose = require("mongoose");

const vestSchema = new mongoose.Schema(
    {
        type: String,
        color: String,
        colorName: String,
        price: String,
        size: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Vest", vestSchema);
