export default function generateFoboProFailTemplate(mailOptions: any) {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>FOBO Pro Update</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .box {
          background-color: #f9f9f9;
          border: 1px solid #ccc;
          padding: 20px;
          margin: 20px;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <p>Hi ${mailOptions.firstName},</p>

        <p>
          We noticed that your FOBO Pro analysis didn’t process as expected.
          No need to worry—we’re already working on it.
        </p>

        <p>
          Our team is resolving the issue on the backend and will have this fixed within 24 - 48 hours.
        </p>

        <p>
          You don’t need to take any action right now, but if you have any questions,
          feel free to reach out to us at hello@altiv.ai
        </p>

        <p>
          Thank you for your patience as we ensure you get the personalized insights you deserve.
        </p>
         <p>
         We’ll notify you as soon as your FOBO Pro results are ready.
        </p>


        <p>Best regards,<br/>The Altiv.AI Team</p>
      </div>
    </body>
    </html>
  `;

  return {
    subject: 'FOBO Pro Update - We’re On It!',
    html: template,
  };
}
