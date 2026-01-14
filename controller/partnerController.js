const { sendUserPartnershipApplicationEmail, sendAdminPartnershipApplicationRequestEmail } = require("../config/email");
const Partner = require("../model/partner");

/**
 * @desc Apply to become a partner
 * @route POST /api/partners/apply
 */
exports.applyPartner = async (req, res) => {
    try {
        const { name, email, phone, brandType, message } = req.body;

        // === REQUIRED FIELD VALIDATION ===
        if (!name || !email || !phone || !brandType || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // === DUPLICATE PREVENTION (email) ===
        const existing = await Partner.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted a partner application. We will get back to you soon.",
            });
        }

        // === SAVE APPLICATION ===
        const application = await Partner.create({
            name,
            email,
            phone,
            brandType,
            message
        });

          // Send email to user confirming booking
            await sendUserPartnershipApplicationEmail(email, name);
        
            // Send email to admin
            const adminEmail = process.env.ADMIN_EMAIL || "fitnessambassador84@gmail.com";
            await sendAdminPartnershipApplicationRequestEmail(adminEmail, name, email, phone, brandType, message);

        res.status(201).json({
            success: true,
            message: "Partner application submitted successfully",
            application
        });

    } catch (err) {
        console.error("Partner Application Error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to submit partner application",
            error: err.message
        });
    }
};

/**
 * @desc Get all partner applications (Admin)
 * @route GET /api/partners
 */
exports.getAllPartners = async (req, res) => {
    try {
        const partners = await Partner.find().sort({ createdAt: -1 });
        res.json(partners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * @desc Review partner application (Admin)
 * @route PUT /api/partners/:id
 */
exports.reviewPartner = async (req, res) => {
    try {
        const partner = await Partner.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(partner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
