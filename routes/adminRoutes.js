const express = require("express");
const { get_all_users, get_payment_proof, update_payment_status} = require("../controller/adminCtrl");
const { getAllBookOrders, confirmPayment } = require("../controller/bookOrderController");

const adminRouter = express.Router();

adminRouter.get("/get-users", get_all_users);
adminRouter.get("/get-payment-proof/:userId", get_payment_proof);
adminRouter.put("/update-payment-status/:userId", update_payment_status);
adminRouter.get("/get-book-orders", getAllBookOrders)
adminRouter.patch("/:id/confirm-payment", confirmPayment);

module.exports = adminRouter;