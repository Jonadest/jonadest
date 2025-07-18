import fs from "fs";
import imagekit from "../config/imagekit.js";
import Comment from "../models/Comment.js";
import Blog from "../models/blog.js";
import generateOpenRouterContent from "../config/openrouter.js";

/** Add Blog */
export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished, hashtags } =
      JSON.parse(req.body.blog);
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "blogs",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image: optimizedImageUrl,
      isPublished,
      hashtags,
    });

    fs.unlinkSync(imageFile.path);

    return res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    console.error("Error in addBlog:", error);

    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Error cleaning up file:", err);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message || "There was an error processing your request",
    });
  }
};

/** Upload Blog Image for Quill (used in Quill imageUploader) */
export const uploadBlogImage = async (req, res) => {
  try {
    const imageFile = req.file;
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "blogs/content",
    });

    fs.unlinkSync(imageFile.path);

    return res.json({ success: true, url: response.url });
  } catch (error) {
    console.error("Image Upload Error:", error);
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Cleanup Error:", err);
      }
    }
    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
    });
  }
};

/** Get All Blogs */
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message,
    });
  }
};

/** Delete Blog */
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Toggle Blog Publish Status */
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: "Blog updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Add Comment */
export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;

    await Comment.create({ blog, name, content });

    res.json({ success: true, message: "Comment added for review" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/** Get Blog Comments */
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;

    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;

    const content = await main(
      prompt + "Generate a blog content for this topic in simple text format"
    );
    res.json({ success: true, content });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}; */

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, message: "Prompt is required" });
    }

    const content = await generateOpenRouterContent(prompt);
    res.json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
