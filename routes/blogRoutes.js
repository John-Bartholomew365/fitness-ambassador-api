const express = require("express");
const {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
} = require("../controller/blogController");

const { isAdmin} = require("../middleware/adminMiddleware");
const upload = require("../middleware/multerMiddleware");

const blogRouter = express.Router();

blogRouter.get("/", getAllBlogs);
blogRouter.get("/:id", getBlogById);

blogRouter.post("/create", isAdmin, upload.single("coverImage"), createBlog);
blogRouter.patch("/:id", isAdmin, upload.single("coverImage"), updateBlog);
blogRouter.delete("/:id", isAdmin, deleteBlog);

module.exports = blogRouter;
