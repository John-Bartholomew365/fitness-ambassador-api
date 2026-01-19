const express = require("express");
const User = require("../model/user");
const { sendPaymentConfirmationEmail } = require("../config/email");
const user = require("../model/user");


// Fetch all users
exports.get_all_users = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .populate("vestId");

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};


// Fetch payment proof for a specific user
exports.get_payment_proof = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!user.paymentProof) {
      return res.status(404).json({ message: "No payment proof uploaded" });
    }

    res.status(200).json({ paymentProof: user.paymentProof });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch payment proof" });
  }
};

// Confirm or reject payment
exports.update_payment_status = async (req, res) => {
    try {
      const { userId } = req.params;
      const { status } = req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
  
      user.payment_status = status;
      if (status === "approved" && !user.notified) {
        await sendPaymentConfirmationEmail(user.email, user.fullName);
        user.notified = true;
      }
  
      await user.save();
  
      res.status(200).json({ message: `Payment status updated to ${status}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update payment status" });
    }
};


