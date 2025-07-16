import { ObjectId } from 'mongodb';
import Booking from '../models/Booking.js';

// POST - Book appointment
export const bookAppointment = async (req, res) => {
  try {
    const data = req.body;

    const bookingData = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city || '',
      styleId: new ObjectId(data.styleId),
      styleTitle: data.styleTitle,
      price: parseFloat(data.price),
      addons: data.addons || '',
      date: data.date,
      time: data.time,
      paymentStatus: 'paid',
      stripeSessionId: data.stripeSessionId || null,
      createdAt: new Date(),
    };

    const errors = {};
    if (!bookingData.fullName) errors.fullName = 'Name is required';
    if (!bookingData.email) errors.email = 'Email is required';
    if (!bookingData.date) errors.date = 'Date is required';
    if (!bookingData.time) errors.time = 'Time is required';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    await Booking.create(bookingData);

    res.status(201).json({ success: true, message: 'Booking successful' });
  } catch (error) {
    console.error('Booking failed:', error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
};

// GET - All bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
