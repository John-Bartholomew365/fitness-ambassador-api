const mongoose = require("mongoose");
const slugify = require("slugify");

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    excerpt: { type: String, required: true },
    coverImage: String,
    content: { type: String, required: true },
    category: { type: String, required: true },
    tags: [String],
    author: { type: String, default: "Admin" },
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    status: { type: String, default: "draft" }
}, { timestamps: true });

// Auto create slug
BlogSchema.pre("save", function (next) {
    if (this.title && !this.slug) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model("Blog", BlogSchema);
