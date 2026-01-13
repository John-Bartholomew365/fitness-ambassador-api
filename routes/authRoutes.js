const express = require("express");
const { register, chooseVest, upload_payment, subscribeNewsletter, loginAdmin, } = require("../controller/authCtrl");
const upload = require("../middleware/multerMiddleware");

const authRouter = express.Router();

authRouter.post("/vest", chooseVest);
authRouter.post("/register", register);
authRouter.post("/upload-proof", upload.single("paymentProof"), upload_payment);
authRouter.post("/subscribe", subscribeNewsletter);
authRouter.post("/admin/login", loginAdmin);


module.exports = authRouter;
