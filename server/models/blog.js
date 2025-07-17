import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subTitle: { type: String },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, required: true },
    category: { type: String, required: true },
    hashtags: [{ type: String }],
    image: { type: String, required: true },
    isPublished: { type: Boolean, required: true },
  },
  { timestamps: true }
);

// ✅ Automatically create slug from title before saving
blogSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next(); // Only slugify if title was changed
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

// ✅ Automatically update slug if title changes during update
blogSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.title) {
    update.slug = slugify(update.title, { lower: true, strict: true });
  }
  next();
});

const Blog = mongoose.model("blog", blogSchema);

export default Blog;
