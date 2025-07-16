import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import { Types } from 'mongoose';
import Style from '../models/style.js';
import { getUserFromCookies } from '../lib/getUserFromCookies.js';

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isValidObjectId = (id) => Types.ObjectId.isValid(id);

// Shared logic for create/edit
const sharedJbcLogic = async (data, userId) => {
  const errors = {};

  const jbcStyles = {
    title: data.title || '',
    desc: data.desc || '',
    price: data.price || '',
    duration: data.duration || '',
    addons: data.addons || '',
    author: userId,
  };

  // Clean string fields
  ['title', 'desc', 'addons'].forEach((field) => {
    if (typeof jbcStyles[field] === 'string') {
      jbcStyles[field] = jbcStyles[field].replace(/(\r\n|\n\r)/g, ' ').trim();
    }
  });

  // Validation
  if (!jbcStyles.title) errors.title = 'Please enter a title';
  if (!jbcStyles.desc) errors.desc = 'Please enter a description';
  if (!jbcStyles.price) errors.price = 'Please enter a price';
  if (!jbcStyles.duration) errors.duration = 'Please enter a duration';

  // Optional Cloudinary signature check
  const { public_id, version, signature } = data;
  if (public_id && version && signature) {
    const expectedSignature = cloudinary.utils.api_sign_request(
      { public_id, version },
      process.env.CLOUDINARY_API_SECRET
    );

    if (expectedSignature === signature) {
      jbcStyles.photo = public_id;
    }
  }

  return { errors, jbcStyles };
};

// GET /api/styles
export const getAllStyles = async (req, res) => {
  try {
    const styles = await Style.find().sort({ order: 1 }); // Sorted by drag-drop order
    res.json(styles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/styles/:id
export const getStyleById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const style = await Style.findById(id).lean();
    if (!style) return res.status(404).json({ error: 'Style not found' });

    res.json({
      ...style,
      _id: style._id.toString(),
      author: style.author.toString(),
    });
  } catch (error) {
    console.error('getStyleById error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/styles
export const createStyles = async (req, res) => {
  const user = await getUserFromCookies(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { errors, jbcStyles } = await sharedJbcLogic(req.body, user.userId);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    await Style.create(jbcStyles);
    res.status(201).json({ message: 'Style created' });
  } catch (err) {
    console.error('createStyles error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// DELETE /api/styles/:id
export const deleteStyles = async (req, res) => {
  const user = await getUserFromCookies(req); // ✅ fixed
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid style ID' });
  }

  try {
    const style = await Style.findById(id);
    if (!style) return res.status(404).json({ error: 'Style not found' });

    if (style.author.toString() !== user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await style.deleteOne();
    res.status(200).json({ message: 'Style deleted' });
  } catch (err) {
    console.error('deleteStyles error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/styles/:id
export const editStyles = async (req, res) => {
  const user = await getUserFromCookies(req); // ✅ fixed
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid style ID' });
  }

  const { errors, jbcStyles } = await sharedJbcLogic(req.body, user.userId);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const style = await Style.findById(id);
    if (!style) return res.status(404).json({ error: 'Style not found' });

    if (style.author.toString() !== user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    Object.assign(style, jbcStyles);
    await style.save();

    res.status(200).json({ message: 'Style updated' });
  } catch (err) {
    console.error('editStyles error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/styles/reorder
export const reorderStyles = async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));

    await Style.bulkWrite(bulkOps);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error reordering styles:', error);
    res
      .status(500)
      .json({ error: 'Internal Server Error', details: error.message });
  }
};
