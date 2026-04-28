import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const session = event.data.object as any;

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const userId = session.metadata.userId;
        const subscriptionId = session.subscription;
        const customerId = session.customer;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const renewalDate = new Date(subscription.current_period_end * 1000).toISOString();

        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: 'active',
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
            subscription_renewal_date: renewalDate
          })
          .eq('id', userId);
        break;

      case 'customer.subscription.updated':
        const updatedSub = event.data.object as any;
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: updatedSub.status === 'active' ? 'active' : 'inactive',
            subscription_renewal_date: new Date(updatedSub.current_period_end * 1000).toISOString()
          })
          .eq('stripe_subscription_id', updatedSub.id);
        break;

      case 'customer.subscription.deleted':
        const deletedSub = event.data.object as any;
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: 'cancelled',
            subscription_renewal_date: null
          })
          .eq('stripe_subscription_id', deletedSub.id);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as any;
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: 'lapsed'
          })
          .eq('stripe_customer_id', failedInvoice.customer);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
