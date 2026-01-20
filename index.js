require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/adminRoutes");
const { isAdmin } = require("./middleware/adminMiddleware");
const blogRouter = require("./routes/blogRoutes");
const partnerRouter = require("./routes/partnerRoutes");
const cartRouter = require("./routes/cartRoutes");
const userRouter = require("./routes/userRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const path = require("path");
const seedAdmin = require("./createAdmin");
const fs = require("fs");

// seedAdmin();

connectDB();

const app = express();
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Test route to check files
app.get("/api/check-files", (req, res) => {
  try {
    const files = fs.readdirSync("uploads");
    res.json({
      success: true,
      files: files,
      count: files.length
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/admin", isAdmin, adminRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/partners", partnerRouter);
app.use("/api/cart", cartRouter);
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));