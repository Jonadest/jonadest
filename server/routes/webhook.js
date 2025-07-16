// app/api/webhook/route.js
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getCollection } from '@/action/createStylesController';
import { sendEmail } from '@/lib/sendEmail';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req) {
  const signature = req.headers.get('stripe-signature');
  let event;

  try {
    const rawBody = await buffer(req.body);
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook verification failed:', {
      error: err.message,
      headers: Object.fromEntries(req.headers),
      rawBody: rawBody
        ? rawBody.toString('utf8').substring(0, 100) + '...'
        : 'undefined',
      signature,
      webhookSecretExists: !!process.env.STRIPE_WEBHOOK_SECRET,
    });
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  console.log(`🔔 Received Stripe event: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('💳 Processing payment for session:', session.id);

    try {
      const bookingsCollection = await getCollection('bookings');

      // Enhanced query to find booking by multiple identifiers
      const booking = await bookingsCollection.findOne({
        $or: [
          { paymentIntentId: session.payment_intent },
          { sessionId: session.id },
          { customerEmail: session.customer_email },
        ],
      });

      if (!booking) {
        console.error('❌ No booking found matching:', {
          paymentIntentId: session.payment_intent,
          sessionId: session.id,
          customerEmail: session.customer_email,
          amount: session.amount_total,
          currency: session.currency,
          paymentStatus: session.payment_status,
        });
        return NextResponse.json(
          {
            error: 'Booking not found',
            details: {
              paymentIntent: session.payment_intent,
              sessionId: session.id,
            },
          },
          { status: 404 }
        );
      }

      console.log('📦 Found booking:', {
        bookingId: booking._id,
        originalStatus: booking.status,
      });

      // Comprehensive update including all relevant Stripe data
      const updateResult = await bookingsCollection.updateOne(
        { _id: booking._id },
        {
          $set: {
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
          },
        }
      );

      console.log('✅ Booking updated:', {
        matchedCount: updateResult.matchedCount,
        modifiedCount: updateResult.modifiedCount,
      });

      // Prepare email data with fallbacks
      const {
        customerName = session.customer_details?.name || 'Customer',
        customerPhone = session.customer_details?.phone ||
          booking.customerPhone,
        title = booking.title || 'Hair Service',
        price = booking.price || session.amount_total / 100,
        bookingDate = booking.bookingDate || new Date(),
      } = booking;

      const formattedDate = new Date(bookingDate).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/New_York',
      });

      // Customer Email Template
      const customerHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px; }
            .header { text-align: center; color: #333; }
            .details { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .button { background: #6772e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; }
            .footer { margin-top: 30px; font-size: 0.9em; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="header">Your Booking Confirmation</h2>
            <p>Hi ${customerName},</p>
            <p>Thank you for booking with <strong>JBC Braids</strong>! Here are your appointment details:</p>
            
            <div class="details">
              <p><strong>Service:</strong> ${title}</p>
              <p><strong>Amount Paid:</strong> $${
                typeof price === 'number' ? price.toFixed(2) : price
              }</p>

              <p><strong>Appointment Date:</strong> ${formattedDate}</p>
              <p><strong>Phone Number:</strong> ${customerPhone}</p>
            </div>

            <p>We're located at:</p>
            <p><em>East Orange NJ, United State</em></p>

            <p style="text-align: center; margin-top: 25px;">
              <a href="mailto:ijannyc@gmail.com" class="button">Contact Us</a>
            </p>
            
            <div class="footer">
              <p>If you need to reschedule, please contact us at least 24 hours in advance.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Admin Notification Template
      const adminHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px; }
            .details { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .button { background: #6772e5; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; display: inline-block; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 style="text-align: center;">📅 New Booking Notification</h2>
            
            <div class="details">
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${
                session.customer_email || booking.customerEmail
              }</p>
              <p><strong>Phone:</strong> ${customerPhone}</p>
              <p><strong>Service:</strong> ${title}</p>
     <p><strong>Amount Paid:</strong> $${
       typeof price === 'number' ? price.toFixed(2) : price
     }</p>

              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Payment ID:</strong> ${session.payment_intent}</p>
              <p><strong>Status:</strong> ${session.payment_status}</p>
            </div>

            <p style="text-align: center;">
              <a href="https://dashboard.stripe.com/payments/${
                session.payment_intent
              }" class="button">View in Stripe</a>
            </p>
          </div>
        </body>
        </html>
      `;

      // Send emails with error handling
      try {
        const emailPromises = [];

        if (session.customer_email || booking.customerEmail) {
          const recipient = session.customer_email || booking.customerEmail;
          emailPromises.push(
            sendEmail({
              to: recipient,
              subject: `Your JBC Braids Booking Confirmation - ${title}`,
              html: customerHtml,
            })
          );
          console.log(`📧 Queued email for: ${recipient}`);
        }

        const adminEmail =
          process.env.ADMIN_EMAIL || 'jbc@em8871.jannybeautycare.com';
        emailPromises.push(
          sendEmail({
            to: adminEmail,
            subject: `🆕 New Booking: ${customerName} - ${title}`,
            html: adminHtml,
          })
        );
        console.log(`📩 Queued admin notification for: ${adminEmail}`);

        await Promise.all(emailPromises);
        console.log('✅ All emails sent successfully');
      } catch (emailError) {
        console.error('❌ Email sending failed:', {
          error: emailError.message,
          stack: emailError.stack,
        });
        // Continue processing even if emails fail
      }

      return NextResponse.json({
        success: true,
        bookingId: booking._id,
        paymentIntent: session.payment_intent,
      });
    } catch (dbError) {
      console.error('❌ Database operation failed:', {
        error: dbError.message,
        stack: dbError.stack,
        sessionId: session.id,
      });
      return NextResponse.json(
        {
          error: 'Database operation failed',
          details: dbError.message,
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    received: true,
    eventType: event.type,
  });
}
