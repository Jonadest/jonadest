import Stripe from 'stripe';
import dotenv from 'dotenv';
import Booking from '../models/Booking.js'; // ✅ Mongoose model
import { sendEmail } from '../lib/sendEmail.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Stripe Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`🔔 Stripe Event Received: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const booking = await Booking.findOne({
        $or: [
          { paymentIntentId: session.payment_intent },
          { sessionId: session.id },
          { customerEmail: session.customer_email },
        ],
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const updateData = {
        status: 'confirmed',
        paymentIntentId: session.payment_intent,
        sessionId: session.id,
        paymentStatus: session.payment_status,
        amountPaid: session.amount_total / 100,
        currency: session.currency,
        customerEmail: session.customer_email || booking.customerEmail,
        updatedAt: new Date(),
        stripeData: {
          payment_method: session.payment_method_types?.[0],
          charge_id: session.payment_intent,
          receipt_url: session.charges?.data?.[0]?.receipt_url,
        },
      };

      await Booking.updateOne({ _id: booking._id }, { $set: updateData });

      const customerName =
        session.customer_details?.name || booking.customerName || 'Customer';
      const customerPhone =
        session.customer_details?.phone || booking.customerPhone || 'N/A';
      const title = booking.title || 'Hair Service';
      const price = booking.price || session.amount_total / 100;
      const bookingDate = booking.date || new Date();

      const formattedDate = new Date(bookingDate).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/New_York',
      });

      const customerHtml = `
        <div style="font-family: sans-serif;">
          <h2>Booking Confirmation</h2>
          <p>Hello ${customerName},</p>
          <p>Your appointment for <strong>${title}</strong> is confirmed.</p>
          <p><strong>Amount Paid:</strong> $${price}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p>Phone: ${customerPhone}</p>
        </div>
      `;

      const adminHtml = `
        <div style="font-family: sans-serif;">
          <h2>New Booking</h2>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${session.customer_email}</p>
          <p><strong>Service:</strong> ${title}</p>
          <p><strong>Amount Paid:</strong> $${price}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Phone:</strong> ${customerPhone}</p>
        </div>
      `;

      try {
        await Promise.all([
          sendEmail({
            to: session.customer_email,
            subject: `Booking Confirmed - ${title}`,
            html: customerHtml,
          }),
          sendEmail({
            to: process.env.ADMIN_EMAIL || 'admin@example.com',
            subject: `New Booking from ${customerName}`,
            html: adminHtml,
          }),
        ]);
      } catch (emailError) {
        console.error('Email error:', emailError.message);
        // Don't fail webhook on email issues
      }

      return res.json({ received: true });
    } catch (err) {
      console.error('❌ Error processing booking:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.json({ received: true });
};
