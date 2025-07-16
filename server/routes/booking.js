import express from 'express';
import {
  bookAppointment,
  getAllBookings,
} from '../controllers/bookAppointmentController.js';

const router = express.Router();

router.get('/', getAllBookings);
router.post('/', bookAppointment);

export default router;
