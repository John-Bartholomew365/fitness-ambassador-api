const mongoose = require("mongoose");
const Blog = require("../model/blog");
const multer = require("multer");
const path = require("path");
const slugify = require("slugify");


/**
 * @desc Get all published blogs (with pagination + filters)
 * @route GET /api/blogs?featured=true&category=Fitness&page=1&limit=10
 */
const getAllBlogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isPublished: true };

    if (req.query.featured === "true") query.featured = true;
    if (req.query.category) query.category = req.query.category;

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      count: blogs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      blogs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc Get blog by ID or slug
 * @route GET /api/blogs/:id
 */

const getBlogById = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate MongoDB ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Only show published blogs to public
    if (!blog.isPublished) {
      return res.status(403).json({
        success: false,
        message: "Blog not published yet",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * @desc Create blog (Admin)
 * @route POST /api/blogs
 */
const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, publish, featured } =
      req.body;

    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "title, excerpt, content & category are required",
      });
    }

    // Prevent duplicate title
    const exists = await Blog.findOne({ title });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Blog title already exists",
      });
    }

    // If multer uploaded file
    let coverImage = "";
    if (req.file) {
      coverImage = `https://fitness-ambassador-api.onrender.com/api/uploads/${req.file.filename}`;
    }

    const blog = await Blog.create({
      title,
      excerpt,
      coverImage,
      content,
      category,
      tags,
      featured: featured === true || featured === "true",
      isPublished: publish === true || publish === "true",
      status: publish === true || publish === "true" ? "published" : "draft",
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

/**
 * @desc Update blog (Admin)
 * @route PUT /api/blogs/:id
 */
const updateBlog = async (req, res) => {
  try {
    const updateData = { ...req.body };

    /* -----------------------------
       Handle publish logic
    ------------------------------*/
    if (updateData.publish !== undefined) {
      updateData.isPublished = String(updateData.publish).toLowerCase() === "true";
      updateData.status = updateData.isPublished ? "published" : "draft";
      delete updateData.publish;
    }

    /* -----------------------------
       Handle featured logic
    ------------------------------*/
    if (updateData.featured !== undefined) {
      updateData.featured = String(updateData.featured).toLowerCase() === "true";
    }

    /* -----------------------------
       Update slug if title changes
    ------------------------------*/
    if (updateData.title) {
      updateData.slug = slugify(updateData.title, { lower: true, strict: true });
    }

    /* -----------------------------
       Update cover image if uploaded
    ------------------------------*/
    if (req.file) {
      updateData.coverImage = `${process.env.BASE_URL}/uploads/blogs/${req.file.filename}`;
    }

    // DEBUG: log update
    console.log("req.params.id:", req.params.id);
    console.log("updateData:", updateData);

    /* -----------------------------
       Update blog
    ------------------------------*/
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!blog) {
      console.log("Blog not found!");
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    console.log("Blog updated:", blog);

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Update blog error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete blog (Admin)
 * @route DELETE /api/blogs/:id
 */
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
