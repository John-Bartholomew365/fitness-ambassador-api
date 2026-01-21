const mongoose = require("mongoose");

const BookOrderSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    additionalNotes: { type: String, default: "" },
    product: { type: String, default: "Workout Compass Book" },
    productPrice: { type: Number, default: 5000 },
    shippingFee: { type: Number, default: 500 },
    totalAmount: { type: Number, required: false },
    paymentReceipt: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending"
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    adminMessage: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookOrder", BookOrderSchema);
