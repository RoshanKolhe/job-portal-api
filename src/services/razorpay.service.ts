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

  // async createOrder(subscriptionDetails: any) {
  //   try {
  //     const amountInPaise = Math.round(subscriptionDetails.planData?.price * 100); // Razorpay accepts amount in paise
  //     const options = {
  //       amount: amountInPaise,
  //       currency: subscriptionDetails.currencyType === 1 ? 'USD' : 'INR',
  //       receipt: `receipt_${subscriptionDetails.id}`,
  //       payment_capture: 1,
  //     };

  //     const order = await this.razorpay.orders.create(options);

  //     return {
  //       orderId: order.id,
  //       amount: order.amount,
  //       currency: order.currency,
  //       receipt: order.receipt,
  //       subscriptionId: subscriptionDetails.id,
  //       razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  //     };
  //   } catch (error) {
  //     console.error('Error creating Razorpay order:', error);
  //     throw error;
  //   }
  // }

  async createPaymentLink(subscriptionDetails: any) {
    try {
      const amountInPaise = Math.round(subscriptionDetails.planData.price * 100);

      const paymentObj = {
        amount: amountInPaise,
        currency: subscriptionDetails.currencyType === 1 ? 'USD' : 'INR',

        description: `Subscription ${subscriptionDetails.id}`,
        reference_id: `sub_${subscriptionDetails.id}`,

        callback_url: `${process.env.REACT_APP_SITE_URL}/payment/verify`,
        callback_method: "get",

        customer: {
          name: subscriptionDetails?.userData?.fullName || 'Shubham Shahane',
          email: subscriptionDetails?.userData?.email || 'shahaneshubham64@gmail.com',
          contact: subscriptionDetails?.userData?.phoneNumber || '7249462782',
        },

        notify: {
          sms: true,
          email: true,
        },

        notes: {
          subscriptionId: subscriptionDetails.id,
        },
      };

      console.log('payment object', paymentObj);

      const paymentLink = await this.razorpay.paymentLink.create(paymentObj);

      return {
        paymentLinkId: paymentLink.id,
        shortUrl: paymentLink.short_url,
        status: paymentLink.status,
        subscriptionId: subscriptionDetails.id,
      };

    } catch (error) {
      console.error("Error creating payment link:", error);
      throw error;
    }
  }
}
