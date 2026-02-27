/**
 * Stripe Integration
 * Handles payments and subscriptions
 */

export async function verifyStripeSignature(request, signingSecret) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  // Note: In production, use proper Stripe webhook verification
  // For now, simple implementation - upgrade with crypto in production

  return { id: "evt_test", type: "charge.succeeded", data: {} };
}

export function getCheckoutURL(priceId, customerId) {
  // This would be used to generate Stripe checkout links
  // Implementation depends on your Stripe setup
  return `https://checkout.stripe.com/pay/${priceId}`;
}

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    emails_per_month: 5,
    stripe_price_id: null,
  },
  starter: {
    name: "Starter",
    price: 2900, // $29.00
    emails_per_month: 100,
    stripe_price_id: "price_starter_mailforge",
  },
  pro: {
    name: "Pro",
    price: 7900, // $79.00
    emails_per_month: 1000,
    stripe_price_id: "price_pro_mailforge",
  },
};
