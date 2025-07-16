// app/api/checkout/route.js
import Stripe from 'stripe';
import { getCollection } from '@/action/createStylesController';
import { ObjectId } from 'mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title,
      price,
      styleId,
      customerName,
      customerEmail,
      customerPhone,
      bookingDate,
    } = body;

    // Create the Stripe checkout session with metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/cancel`,
      metadata: {
        styleId,
        customerName,
        customerEmail,
        customerPhone,
        bookingDate,
        title,
        price: price.toString(),
      },
      customer_email: customerEmail, // Pre-fill email in Stripe checkout
    });

    // Create a temporary booking record in MongoDB (status: pending)
    const bookingsCollection = await getCollection('bookings');
    await bookingsCollection.insertOne({
      customerName,
      customerEmail,
      customerPhone,
      styleId: new ObjectId(styleId),
      price,
      bookingDate: new Date(bookingDate),
      paymentIntentId: session.payment_intent,
      status: 'pending',
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
    });
  } catch (error) {
    console.error('Checkout API Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
