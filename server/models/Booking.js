// server/models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    styleTitle: String,
    price: Number,
    bookingDate: Date,
    paymentIntentId: String,
    sessionId: String,
    amountPaid: Number,
    currency: String,
    paymentStatus: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    stripeData: {
      payment_method: String,
      charge_id: String,
      receipt_url: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
  },
  { collection: 'bookings' }
);

export default mongoose.models.Booking ||
  mongoose.model('Booking', bookingSchema);
