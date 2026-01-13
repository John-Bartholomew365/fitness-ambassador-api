const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    vestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vest",
      required: function () {
        return this.role !== "admin";   // vestId required only for users
      }
    },
    registration_id: { type: String, unique: true },

    fullName: String,
    phoneNumber: String,
    gender: String,
    dobDay: Number,
    dobMonth: String,

    medicalCondition: { type: Boolean, default: false },
    medicalDetails: String,
    emergencyName: String,
    emergencyPhone: String,

    registrationStatus: {
      type: String,
      enum: ["VEST_SELECTED", "REGISTERED"],
      default: "VEST_SELECTED",
    },

    payment_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    payment_proof: {
      type: String,   // URL or filename of uploaded proof image
      default: null
    },
    role:{
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
