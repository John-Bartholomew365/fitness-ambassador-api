const express = require("express");
const router = express.Router();
const {
  getBookOrderById,
  updateBookOrder,
  deleteBookOrder,
  confirmPayment,
  updateOrderStatus
} = require("../controller/bookOrderController");
const { isAdmin } = require("../middleware/authMiddleware");


// Update order status (admin only)
router.patch("/:id/status", isAdmin, updateOrderStatus);

module.exports = router;
