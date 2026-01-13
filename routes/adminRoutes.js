const express = require("express");
const { get_all_users, get_payment_proof, update_payment_status} = require("../controller/adminCtrl");

const adminRouter = express.Router();

adminRouter.get("/get-all-users", get_all_users);
adminRouter.get("/get-payment-proof/:userId", get_payment_proof);
adminRouter.put("/update-payment-status/:userId", update_payment_status);

module.exports = adminRouter;