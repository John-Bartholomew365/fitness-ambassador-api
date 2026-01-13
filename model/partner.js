const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema({
    name: { type: String, required: true },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    phone: { type: String, required: true },
    brandType: { type: String, required: true },
    message: { type: String, required: true },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("PartnerApplication", PartnerSchema);
