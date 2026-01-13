const User = require("../model/user");

const isPaymentConfirmed = async (req, res, next) => {
  try {
    console.log("req.user:", req.user);
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.payment_status !== "Confirmed") {
      return res.status(403).json({ message: "Payment not confirmed. Please verify your payment first." });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = isPaymentConfirmed;
