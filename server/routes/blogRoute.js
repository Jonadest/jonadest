import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  getBlogComments,
  togglePublish,
  uploadBlogImage,
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

/* PUBLIC */
blogRouter.get("/all", getAllBlogs);
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
