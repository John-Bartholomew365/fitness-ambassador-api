// models/TrainingJourney.js
const mongoose = require("mongoose");

const TrainingJourneySchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  experienceLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true
  },
  plan: {
    type: String,
    enum: ["basic", "standard", "premium"],
    required: true
  },
  fitnessGoal: String,
  status: { type: String, default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("TrainingJourney", TrainingJourneySchema);
