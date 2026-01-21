const express = require("express");
const { bookTraining, bookSession } = require("../controller/bookingController");
const upload = require("../middleware/multerMiddleware");
const { createBookOrder } = require("../controller/bookOrderController");

const userRouter = express.Router();

userRouter.post("/book-training", bookTraining);
userRouter.post("/book-session", bookSession)
userRouter.post("/order-book", upload.single("paymentReceipt"), createBookOrder);

module.exports = userRouter;