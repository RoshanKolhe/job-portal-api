import { injectable, BindingScope } from '@loopback/core';
import Razorpay from 'razorpay';
import { config } from 'dotenv';

config();

@injectable({ scope: BindingScope.TRANSIENT })
export class RazorPayService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });
  }

  async createOrder(subscriptionDetails: any) {
    try {
      console.log('subscriptionDetails', subscriptionDetails);
      const amountInPaise = Math.round(subscriptionDetails.planData?.price * 100); // Razorpay accepts amount in paise
      console.log('amountInPaise', amountInPaise);
      const options = {
        amount: amountInPaise,
        currency: subscriptionDetails.currencyType === 1 ? 'USD' : 'INR',
        receipt: `receipt_${subscriptionDetails.id}`,
        payment_capture: 1,
      };

      const order = await this.razorpay.orders.create(options);

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        subscriptionId: subscriptionDetails.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }
}
