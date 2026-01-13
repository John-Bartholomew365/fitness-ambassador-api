const express = require("express");
const {
    applyPartner,
    getAllPartners,
    reviewPartner
} = require("../controller/partnerController");

const { isAdmin } = require("../middleware/adminMiddleware");

const partnerRouter = express.Router();

partnerRouter.post("/apply", applyPartner);
partnerRouter.get("/", isAdmin, getAllPartners);
partnerRouter.put("/:id", isAdmin, reviewPartner); 

module.exports = partnerRouter;