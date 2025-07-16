// models/style.js
import mongoose from 'mongoose';

const styleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: String, required: true },
    duration: { type: String, required: true },
    addons: { type: String, default: '' },
    photo: { type: String },
    order: { type: Number, default: 0 },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // ✅ Auto adds createdAt & updatedAt
  }
);

export default mongoose.model('Style', styleSchema);
