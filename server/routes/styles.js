import express from 'express';
import {
  getAllStyles,
  getStyleById,
  createStyles,
  deleteStyles,
  editStyles,
  reorderStyles, // 🆕 import
} from '../controllers/styleController.js';

const router = express.Router();

router.get('/', getAllStyles);
router.get('/:id', getStyleById);
router.post('/', createStyles);
router.put('/:id', editStyles);
router.delete('/:id', deleteStyles);
router.post('/reorder', reorderStyles); // 🆕 route

export default router;
