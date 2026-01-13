const express = require("express");
const { bookTraining, bookSession } = require("../controller/bookingController");

const userRouter = express.Router();

userRouter.post("/book-training", bookTraining);
userRouter.post("/book-session", bookSession)

module.exports = userRouter;