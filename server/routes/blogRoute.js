import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  togglePublish,
  uploadBlogImage,
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";
import Blog from "../models/blog.js";

const blogRouter = express.Router();

/* PUBLIC */
blogRouter.get("/all", getAllBlogs);

/* blogRouter.get("/slug/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}); */

blogRouter.get("/slug/:slug", getBlogBySlug);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/add-comment", addComment);
blogRouter.post("/comment", getBlogComments);
blogRouter.post("/upload-image", upload.single("image"), uploadBlogImage);

/* ADMIN */
blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.post("/delete", auth, deleteBlogById);
blogRouter.post("/toggle-publish", auth, togglePublish);

blogRouter.post("/generate", auth, generateContent);

export default blogRouter;
