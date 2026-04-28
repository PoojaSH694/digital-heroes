import { stripe, PLANS } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { plan, userId, email } = await req.json();
    
    if (!plan || !userId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];
    if (!selectedPlan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: selectedPlan.priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?subscribed=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/signup`,
      metadata: { userId, plan },
      subscription_data: {
        metadata: { userId, plan }
      }
    });
    
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
