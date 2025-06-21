import { injectable, BindingScope } from '@loopback/core';
import Stripe from 'stripe';
import { config } from 'dotenv';

config(); 

@injectable({ scope: BindingScope.TRANSIENT })
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async createCheckoutSession(subscriptionDetails: any) {    
    try {
      // Create a product and price for main service
      const mainProduct = await this.stripe.products.create({
        name: 'Upgrade Account',
      });

      const mainPrice = await this.stripe.prices.create({
        unit_amount: subscriptionDetails.planData?.price * 100, // Amount in cents
        currency: 'inr',
        product: mainProduct.id,
      });

      // Create a Checkout Session
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: mainPrice.id,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.API_ENDPOINT}/subscriptions/callbackurl/${subscriptionDetails.id}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.API_ENDPOINT}/subscriptions/cancel/callbackurl/${subscriptionDetails.id}`,
      });

      // Return the session ID
      return { sessionId: session.id, sessionUrl: session.url };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
}