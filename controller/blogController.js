// const mongoose = require("mongoose");
// const Blog = require("../model/blog");
// const multer = require("multer");
// const path = require("path");

// /**
//  * @desc Get all published blogs (with pagination + filters)
//  * @route GET /api/blogs?featured=true&category=Fitness&page=1&limit=10
//  */
// const getAllBlogs = async (req, res) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const query = { isPublished: true };

//     if (req.query.featured === "true") query.featured = true;
//     if (req.query.category) query.category = req.query.category;

//     const blogs = await Blog.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await Blog.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       message: "Blogs fetched successfully",
//       count: blogs.length,
//       total,
//       page,
//       pages: Math.ceil(total / limit),
//       blogs,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * @desc Get blog by ID or slug
//  * @route GET /api/blogs/:id
//  */

// const getBlogById = async (req, res) => {
//   try {
//     const id = req.params.id;

//     // Validate MongoDB ID
//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid blog ID format",
//       });
//     }

//     const blog = await Blog.findById(id);

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: "Blog not found",
//       });
//     }

//     // Only show published blogs to public
//     if (!blog.isPublished) {
//       return res.status(403).json({
//         success: false,
//         message: "Blog not published yet",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Blog fetched successfully",
//       blog,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// /**
//  * @desc Create blog (Admin)
//  * @route POST /api/blogs
//  */
// const createBlog = async (req, res) => {
//   try {
//     const { title, excerpt, content, category, tags, publish, featured } =
//       req.body;

//     if (!title || !excerpt || !content || !category) {
//       return res.status(400).json({
//         success: false,
//         message: "title, excerpt, content & category are required",
//       });
//     }

//     // Prevent duplicate title
//     const exists = await Blog.findOne({ title });
//     if (exists) {
//       return res.status(400).json({
//         success: false,
//         message: "Blog title already exists",
//       });
//     }

//     // If multer uploaded file
//     const baseUrl = "https://fitness-ambassador-api.onrender.com";

//     // let coverImage = "";
//     // if (req.file) {
//     //     coverImage = `${baseUrl}/uploads/blogs/${req.file.filename}`;
//     // }

//     // To this:
//     let coverImage = "";
//     if (req.file) {
//       // Save the FULL CORRECT URL
//       coverImage = `https://fitness-ambassador-api.onrender.com/api/uploads/blogs/${req.file.filename}`;
//     }

//     const blog = await Blog.create({
//       title,
//       excerpt,
//       coverImage,
//       content,
//       category,
//       tags,
//       featured: featured === true || featured === "true",
//       isPublished: publish === true || publish === "true",
//       status: publish === true || publish === "true" ? "published" : "draft",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Blog created successfully",
//       blog,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create blog",
//       error: error.message,
//     });
//   }
// };

// /**
//  * @desc Update blog (Admin)
//  * @route PUT /api/blogs/:id
//  */
// const updateBlog = async (req, res) => {
//   try {
//     const { publish, featured } = req.body;

//     let updateData = { ...req.body };

//     if (publish !== undefined) {
//       updateData.isPublished = publish === true || publish === "true";
//       updateData.status = updateData.isPublished ? "published" : "draft";
//     }

//     if (featured !== undefined) {
//       updateData.featured = featured === true || featured === "true";
//     }

//     const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!blog)
//       return res
//         .status(404)
//         .json({ success: false, message: "Blog not found" });

//     res.status(200).json({
//       success: true,
//       message: "Blog updated successfully",
//       blog,
//     });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// /**
//  * @desc Delete blog (Admin)
//  * @route DELETE /api/blogs/:id
//  */
// const deleteBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findByIdAndDelete(req.params.id);

//     if (!blog) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Blog not found" });
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Blog deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// module.exports = {
//   getAllBlogs,
//   getBlogById,
//   createBlog,
//   updateBlog,
//   deleteBlog,
// };

const mongoose = require("mongoose");
const Blog = require("../model/blog");
const multer = require("multer");
const path = require("path");

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
    const { publish, featured } = req.body;

    let updateData = { ...req.body };

    if (publish !== undefined) {
      updateData.isPublished = publish === true || publish === "true";
      updateData.status = updateData.isPublished ? "published" : "draft";
    }

    if (featured !== undefined) {
      updateData.featured = featured === true || featured === "true";
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
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
