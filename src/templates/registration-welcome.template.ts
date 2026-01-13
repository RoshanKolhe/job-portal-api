export default function generateWelcomeTemplate(mailOptions: any) {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Welcome to Altiv</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .box {
          background-color: #f9f9f9;
          border: 1px solid #ccc;
          padding: 20px;
          margin: 20px;
        }
        .cta {
          font-weight: bold;
          color: #ff6600;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <p>Hi ${mailOptions.firstName},</p>
      </div>
    </body>
    </html>
  `;

  return {
    subject: 'Welcome to Altiv.AI – Take Charge of Your AI Future',
    html: template,
  };
}
