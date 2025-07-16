import express from "express";
import Newsletter from "../models/Newsletter.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // Check for duplicate
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Email already subscribed" });
    }

    await Newsletter.create({ email });
    res.json({ success: true, message: "Subscribed successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
