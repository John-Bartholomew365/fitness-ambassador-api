const express = require("express");
const {
    addToCart,
    getCart,
    clearCart
} = require("../controller/cartController");

const authMiddleware = require("../middleware/authMiddleware");

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.get("/", authMiddleware, getCart);
cartRouter.delete("/", authMiddleware, clearCart);

module.exports = cartRouter;    