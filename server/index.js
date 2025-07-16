import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import adminRouter from "./routes/adminRoute.js";
import blogRouter from "./routes/blogRoute.js";
import newsletterRoutes from "./routes/newsletter.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("API is running!!!");
});

app.use("/api/blog/admin/", adminRouter);
app.use("/api/blog/", blogRouter);
app.use("/api/newsletter", newsletterRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
