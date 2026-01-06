export default function generateFoboRunTemplate(mailOptions: any) {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Your FOBO Scan Results Are In – What’s Next?</title>
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
       You’ve taken the first step toward future-proofing your career by running your FOBO Scan.
        That’s a big move - well done!
        Now, let’s break down your results and help you interpret what they mean for your career in an AI-driven world.
        </p>

        <h3>Understanding Your FOBO Results</h3>
          <p>Your FOBO Scan has categorized the tasks you do into three types:</p>
        <ul>
          <li><b>AI-Automated:</b> Tasks likely to be fully replaced by AI.</li>
          <li><b>AI-Augmented:</b> Tasks where AI enhances efficiency but still needs your expertise.</li>
          <li><b>Human-Only:</b> Tasks that remain uniquely yours and require creativity, empathy, or leadership.</li>
        </ul>
   <p>These are your strengths to double down on.</p>
        <p>
          This snapshot is your starting point. But to go deeper and truly unlock career-transforming insights,
          we recommend upgrading to FOBO Pro.
        </p>

        <h3>Why FOBO Pro?</h3>
        <p>With FOBO Pro, you’ll get:</p>
        <ul>
          <li><b>Detailed Insights:</b> A deeper analysis of each task to highlight skill gaps.</li>
          <li><b>Personalized Roadmap:</b> A step-by-step plan to pivot, upskill, or adapt.</li>
          <li><b>Future-Proof Role Advice:</b> Recommendations for AI-ready roles suited to your strengths.</li>
          <li><b>Skill Erosion Forecast:</b> Learn which skills are at risk and how to replace them.
                This isn’t just about understanding your role today—it’s about preparing for what’s coming next.</li>
        </ul>
         <p class="cta">
          👉 <a href="${mailOptions.foboUrl}" target="_blank">Upgrade to FOBO Pro Now</a>
        </p>
       <h3>Take Charge of Your Career</h3>
        <p>
       AI is here, and it’s disrupting industries faster than ever.
       The professionals who take charge now by understanding, adapting, and
       upskilling will be the ones thriving tomorrow. Will you be one of them?
        </p>

           <p class="cta">
          👉 <a href="${mailOptions.foboUrl}" target="_blank">Unlock FOBO Pro Today</a>
        </p>

        <p>Here’s to your success,<br/>The Altiv.AI Team</p>
      </div>
    </body>
    </html>
  `;

  return {
    subject: 'Your FOBO Scan Results Are In – What’s Next?',
    html: template,
  };
}
