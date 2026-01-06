export default function generatePaymentSuccessTemplate(mailOptions: any) {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Successful</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .box {
          background-color: #f9f9f9;
          border: 1px solid #ccc;
          padding: 20px;
          margin: 20px;
        }
        .cta { font-weight: bold; color: #ff6600; }
      </style>
    </head>
    <body>
      <div class="box">
        <p>Hi ${mailOptions.firstName},</p>

        <p>
          Your payment of ₹${mailOptions.amount} for ${mailOptions.productName} has been successfully processed.
          You’re now ready to take charge of your career with exclusive access to all the benefits of your purchase.
        </p>

        <p class="cta">👉 Access Your Dashboard Now</p>

  <p>
  Thank you for choosing Altiv.AI! In case you need an invoice, please send an email to
  <a href="mailto:${mailOptions.supportEmail}" target="_blank">
    ${mailOptions.supportEmail}
  </a>
  and we will send you a copy.
</p>

        <p>Best regards,<br/>The Altiv.AI Team</p>
      </div>
    </body>
    </html>
  `;

  return {
    subject: `Payment Successful – Welcome to ${mailOptions.productName}`,
    html: template,
  };
}
