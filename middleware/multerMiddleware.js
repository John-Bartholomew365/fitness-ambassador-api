const multer = require("multer");
const path = require("path");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize Multer for a single file upload
const upload = multer({ storage });

// Middleware for uploading a single image
const uploadPlayerImage = upload.single("image");

module.exports = uploadPlayerImage ;