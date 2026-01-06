export default function generateFoboProSuccessTemplate(mailOptions: any) {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Welcome to FOBO Pro</title>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .box {
          background-color: #f9f9f9;
          border: 1px solid #ccc;
          padding: 20px;
          margin: 20px;
        }
        .section-title {
          font-weight: bold;
          margin-top: 20px;
        }
        .cta {
          margin: 15px 0;
          font-weight: bold;
          color: #ff6600;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <p>Hi ${mailOptions.firstName},</p>

        <p>
          Welcome to FOBO Pro! You’ve unlocked a powerful tool to analyze your current career,
          identify gaps, and create a clear roadmap to thrive in an AI-driven world.
        </p>

        <div class="section-title">Your FOBO Pro Insights</div>

        <p>Here’s what your FOBO Pro analysis delivers:</p>

        <div class="section-title">Current State Analysis</div>
        <ul>
          <li>
            <b>Key Skills Overview:</b> A personalized breakdown of your skills based on your profile,
            backed by evidence from your tasks and strengths.
          </li>
          <li>
            <b>AI-Readiness Gap:</b> Clear insights into where your current skills stand in relation
            to the demands of an AI-dominated workplace.
          </li>
        </ul>

        <div class="section-title">Strategic Objectives</div>
        <p>
          A custom roadmap tailored to your profile that outlines strategic objectives to close
          the AI-readiness gap.
        </p>

        <div class="section-title">Transformation Roadmap</div>
        <ul>
          <li><b>Capability Building:</b> Guidance on acquiring essential skills to remain competitive.</li>
          <li><b>Tool Stack Recommendations:</b> Specific AI tools and platforms that align with your career goals.</li>
          <li><b>30-Day Quick Start:</b> A step-by-step action plan to begin meeting your strategic objectives today.</li>
        </ul>

        <p class="cta">
          👉 <a href="${mailOptions.foboProUrl}" target="_blank">Access your FOBO Pro Results</a>
        </p>

        <div class="section-title">What’s Next?</div>
        <p>Your journey doesn’t stop here. Dive deeper into FOBO Pro’s advanced analysis:</p>

        <ul>
          <li><b>Skill Erosion Insights:</b> Identify skills at risk of becoming obsolete.</li>
          <li><b>Task Automation Analysis:</b> Understand which tasks will likely be automated and how to adapt.</li>
        </ul>

        <div class="section-title">Share the Transformation</div>
        <p>
          Know someone who could benefit from FOBO Pro? Share <b> Altiv.AI </b>. with your network and help
          them get AI-ready too!
        </p>

        <p>
          Thank you for trusting us with your career transformation. The future is AI-driven,
          and you’re ready for it!
        </p>

        <p>
          Here’s to your success,<br/>
          The Altiv.AI Team
        </p>
      </div>
    </body>
    </html>
  `;

  return {
    subject: 'Welcome to FOBO Pro – Your Career Roadmap Awaits!',
    html: template,
  };
}
