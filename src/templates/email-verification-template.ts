export default function generateVerificationEmailTemplate(mailOptions: any) {
  const template = `<!DOCTYPE html>
<html>
<head>
  <title>Verify Your Email - Altiv AI</title>
</head>

<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 20px auto;
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .header {
    text-align: center;
    background: #007bff;
    color: #ffffff;
    padding: 15px;
    border-radius: 8px 8px 0 0;
  }
  .content {
    padding: 20px;
    font-size: 16px;
    color: #333;
  }
  .button {
    display: inline-block;
    background: #007bff;
    color: #ffffff;
    padding: 12px 20px;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    margin-top: 15px;
  }
  .footer {
    text-align: center;
    font-size: 14px;
    color: #666;
    padding: 10px;
    margin-top: 20px;
    border-top: 1px solid #ddd;
  }
</style>

<body>

<div class="container">
  <div class="header">
    <h2>Verify Your Email</h2>
  </div>

  <div class="content">
    <p>Hello <strong>${mailOptions?.userData?.fullName} ${mailOptions?.userData?.fullName, ''
    }</strong>,</p>

    <p>Thank you for registering with <strong>Altiv AI</strong>. Before you get started, we need to verify your email address.</p>

    <p>Please click the button below to verify your email:</p>

    <p>
      <a class="button" href="${mailOptions?.verificationLink}" target="_blank">
        Verify Email
      </a>
    </p>

    <p>This link will expire in <strong>24 hours</strong>.</p>

    <p>If you did not create an account, you can safely ignore this email.</p>

    <p>Best Regards,<br>
    <strong>Altiv AI Team</strong></p>
  </div>

  <div class="footer">
    &copy; 2025 Altiv AI. All rights reserved.
  </div>
</div>

</body>
</html>`;

  return {
    subject: 'Verify Your Email - Altiv AI',
    html: template,
  };
}
