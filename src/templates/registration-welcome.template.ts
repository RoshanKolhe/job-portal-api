export default function generateWelcomeTemplate(mailOptions: any) {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Welcome to Altiv.AI– Take Charge of Your AI Future</title>
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

        <p>
          Welcome to Altiv.AI—your trusted partner in navigating the AI revolution.
          With AI transforming industries faster than ever, it’s time to future-proof your career with actionable, personalized insights.
        </p>

        <h3>Start with FOBO – Your Personalized AI Impact Report</h3>

        <p>Unlike generic tools that base results on job titles or quick surveys, FOBO (Fear of Becoming Obsolete) uses state-of-the-art AI to analyze what you actually do. It identifies:</p>

        <ul>
          <li>Tasks that can be AI-Automated.</li>
          <li>Tasks that can be AI-Augmented.</li>
          <li>Human-Only tasks that remain uniquely yours.</li>
        </ul>

        <p>This customized analysis gives you clarity on how AI will affect your role and provides a tailored roadmap to stay ahead.</p>

         <p class="cta">
          👉 <a href="${mailOptions.foboUrl}" target="_blank">Check FOBO Score</a>
        </p>



        <p>
          Explore how Altiv.AI can help you stay ahead of the AI curve with expert-curated blogs, role-specific courses, and a community of forward-thinking professionals.
        </p>

        <p>The AI revolution is here. Take charge of your future today.</p>

       <p class="cta">
          👉 <a href="${mailOptions.foboUrl}" target="_blank">Start Your FOBO Scan</a>
        </p>

        <p>Here’s to staying ahead,<br/>The Altiv.AI Team</p>
      </div>
    </body>
    </html>
  `;

  return {
    subject: 'Welcome to Altiv.AI – Take Charge of Your AI Future',
    html: template,
  };
}
