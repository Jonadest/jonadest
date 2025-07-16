import express from "express";
import {
  adminLogin,
  approveCommentById,
  deleteCommentById,
  getAllBlogsAdmin,
  getAllComments,
  getAllDrafts,
  getDashboard,
} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";

const adminRouter = express.Router();
adminRouter.post("/login", adminLogin);
adminRouter.get("/comments", auth, getAllComments);
adminRouter.get("/", getAllBlogsAdmin);
adminRouter.get("/drafts", auth, getAllDrafts);
adminRouter.post("/delete-comment", auth, deleteCommentById);
adminRouter.post("/approve-comment", auth, approveCommentById);
adminRouter.get("/blog", auth, getDashboard);

export default adminRouter;
