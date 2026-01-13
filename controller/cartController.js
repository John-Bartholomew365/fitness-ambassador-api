const Cart = require("../model/cart");
const GymWear = require("../model/gymwear");

/**
 * @desc Add item to cart
 * @route POST /api/cart/add
 */
exports.addToCart = async (req, res) => {
    try {
        const { wearId, size, quantity } = req.body;

        const wear = await GymWear.findById(wearId);
        if (!wear) return res.status(404).json({ message: "Item not found" });

        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            cart = await Cart.create({ userId: req.user._id, items: [] });
        }

        cart.items.push({ wearId, size, quantity });
        await cart.save();

        res.json(cart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

/**
 * @desc Get user's cart
 * @route GET /api/cart
 */
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id })
            .populate("items.wearId");
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * @desc Clear cart
 * @route DELETE /api/cart
 */
exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.user._id });
        res.json({ message: "Cart cleared" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
