const BookOrder = require("../model/bookOrder");
const fs = require("fs");
const path = require("path");
const { sendUserBookOrderEmail, sendUserBookOrderApproveEmail, sendAdminBookOrderEmail, sendUserBookOrderRejectEmail } = require("../config/email");

// Create a new book order
const createBookOrder = async (req, res) => {
    try {
        const {
            fullName,
            phoneNumber,
            email,
            deliveryAddress,
            additionalNotes
        } = req.body;

        if (
            !fullName ||
            !phoneNumber ||
            !email ||
            !deliveryAddress
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Payment receipt is required"
            });
        }

        const baseUrl = "https://fitness-ambassador-api.onrender.com";
        const receiptUrl = `${baseUrl}/${req.file.path.replace(/\\/g, "/")}`;

        const order = await BookOrder.create({
            fullName,
            phoneNumber,
            email,
            deliveryAddress,
            additionalNotes,
            totalAmount: 5500,
            paymentReceipt: receiptUrl
        });

         // Send email to user confirming booking
        await sendUserBookOrderEmail(email, fullName);
        
            // Send email to admin
            const adminEmail = process.env.ADMIN_EMAIL || "fitnessambassador84@gmail.com";
        await sendAdminBookOrderEmail(
            adminEmail, fullName, email, phoneNumber, deliveryAddress, additionalNotes);

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        console.error("Book order error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to place order"
        });
    }
};

// Get all book orders
const getAllBookOrders = async (req, res) => {
  try {
    const orders = await BookOrder.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error("Error fetching book orders:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching book orders",
      error: error.message
    });
  }
};

// Confirm payment for book order
// const confirmPayment = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const order = await BookOrder.findByIdAndUpdate(
//       id,
//       { paymentStatus: "confirmed", updatedAt: Date.now() },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Book order not found"
//       });
//     }
//       // Send email to user confirming booking
//       await sendUserBookOrderApproveEmail(order.email, order.fullName);

//     return res.status(200).json({
//       success: true,
//       message: "Payment confirmed successfully",
//       data: order
//     });
//   } catch (error) {
//     console.error("Error confirming payment:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error confirming payment",
//       error: error.message
//     });
//   }
// };

const confirmPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus, adminMessage } = req.body;

        // 🔒 Validate status
        if (!["confirmed", "failed"].includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment status. Use 'confirmed' or 'failed'"
            });
        }

        const order = await BookOrder.findByIdAndUpdate(
            id,
            {
                paymentStatus,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Book order not found"
            });
        }

        /* ================= EMAIL HANDLING ================= */

        if (paymentStatus === "confirmed") {
            // ✅ Approval email
            await sendUserBookOrderApproveEmail(
                order.email,
                order.fullName
            );
        }

        if (paymentStatus === "failed") {
            // ❌ Rejection email
            await sendUserBookOrderRejectEmail(
                order.email,
                order.fullName,
                adminMessage
            );
        }

        return res.status(200).json({
            success: true,
            message: `Payment ${paymentStatus} successfully`,
            data: order
        });

    } catch (error) {
        console.error("Error confirming payment:", error);
        return res.status(500).json({
            success: false,
            message: "Error confirming payment",
            error: error.message
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (
      !["pending", "processing", "shipped", "delivered", "cancelled"].includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order = await BookOrder.findByIdAndUpdate(
      id,
      { orderStatus, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Book order not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message
    });
  }
};

module.exports = {
  createBookOrder,
  getAllBookOrders,
  confirmPayment,
  updateOrderStatus
};
