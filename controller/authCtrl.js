const User = require("../model/user");
const {sendRegistrationEmail, sendNewsletterConfirmation } = require("../config/email");
const generateTicketId = require("../utilis/ticketIdGenerator");
const Vest = require("../model/vest");
const multer = require("multer");
const Newsletter = require("../model/newsletter");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================== CHOOSE VEST ==================
exports.chooseVest = async (req, res) => {
  try {
    const { type, color, colorName, price, size } = req.body;

    const vest = await Vest.create({
      type,
      color,
      colorName,
      price,
      size,
    });

    res.status(201).json({
      message: "Vest selected successfully",
      vestId: vest._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================== REGISTER USER ==================
exports.register = async (req, res) => {
  const {
    email,
    vestId,
    fullName,
    phoneNumber,
    gender,
    dobDay,
    dobMonth,
    medicalCondition,
    medicalDetails,
    emergencyName,
    emergencyPhone,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        statusCode: "01",
        message: "Email already registered",
      });

    const vest = await Vest.findById(vestId);
    if (!vest) return res.status(400).json({ message: "Invalid Vest ID" });

    // If medical condition is YES, ensure details are provided
    if (
      medicalCondition &&
      medicalCondition === true &&
      (!medicalDetails || medicalDetails.trim() === "")
    ) {
      return res.status(400).json({
        message: "Please provide medical condition details",
      });
    }

    // generate unique registration id
    let registration_id;
    while (true) {
      registration_id = generateTicketId();
      const exists = await User.findOne({ registration_id });
      if (!exists) break;
    }

    const user = await User.create({
      registration_id,
      email,
      vestId,
      fullName,
      phoneNumber,
      gender,
      dobDay,
      dobMonth,
      medicalDetails: medicalCondition?.true? medicalDetails : null,
      medicalDetails,
      emergencyName,
      emergencyPhone,
      registrationStatus: "REGISTERED",
      payment_status: "pending",
      role:'user'
    });

    // OPTIONAL — send OTP if you actually have OTP logic
    await sendRegistrationEmail(email, fullName);

    res.status(201).json({
      statusCode: "00",
      message: "Registration successful",
      data: { userId: user._id, fullName, email, registration_id },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ statusCode: "01", message: "Server error", error: error.message });
  } 
};


// ================== PAYMENT PROOF UPLOAD ==================
exports.upload_payment = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files || !req.files.paymentProof)
      return res.status(400).json({ message: "Payment proof is required" });

    const filePath = req.files.paymentProof[0].path;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.paymentProof = filePath;
    user.payment_status = "pending"; // change to approved if you want auto-approval
    await user.save();

    res.status(200).json({
      message: "Payment uploaded successfully",
      user,
    });
  } catch (error) {
    console.error("Payment upload error:", error);
    res.status(500).json({ message: "Failed to upload payment proof" });
  }
};

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email already exists
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already subscribed" });
    }

    // Save email to database
    const subscription = await Newsletter.create({ email });

    // Send confirmation email
    await sendNewsletterConfirmation(email);

    res.status(201).json({ success: true, message: "Subscribed to newsletter successfully", subscription });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to subscribe", error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const dbAdmin = await User.findOne({ email });

    // If no user found
    if (!dbAdmin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // Must be admin
    if (dbAdmin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not an admin",
      });
    }

    // If admin has password saved, verify with bcrypt
    if (dbAdmin.password) {
      const match = await bcrypt.compare(password || "", dbAdmin.password);
      if (!match) {
        return res.status(401).json({
          success: false,
          message: "Invalid admin credentials",
        });
      }
    } else {
      // If admin exists but has no password (rare edge case)
      return res.status(401).json({
        success: false,
        message: "Admin password not set",
      });
    }

    // Create token
    const payload = {
      userId: dbAdmin._id,
      role: dbAdmin.role,
      email: dbAdmin.email,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        id: dbAdmin._id,
        email: dbAdmin.email,
        role: dbAdmin.role,
      },
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
