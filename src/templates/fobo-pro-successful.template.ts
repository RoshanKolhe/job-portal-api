export default function generateFoboProSuccessTemplate(mailOptions: any) {
  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Welcome to AI Action Plan - Your Roadmap Awaits!</title>

      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          margin: 0;
          padding: 0;
        }

        .box {
          padding: 24px;
          margin: 20px auto;
          max-width: 600px;
          border-radius: 6px;
        }

        h3 {
          margin-top: 24px;
        }

        ul {
          padding-left: 20px;
        }

        .cta {
          margin: 20px 0;
          font-weight: bold;
        }

        .cta a {
          color: royalblue;
          text-decoration: none;
        }
      </style>
    </head>

    <body>
      <div class="box">

        <p>Hi ${mailOptions.firstName},</p>

        <p>
          Welcome to AI Action Plan! You’ve unlocked a powerful tool to analyze
          your current career, identify gaps, and create a clear roadmap
          to thrive in an AI-driven world.
        </p>

        <h3>Your AI Action Plan Insights</h3>

        <p>Here’s what your AI Action Plan analysis delivers:</p>

        <h3>1. Current State Analysis</h3>

        <ul>
          <li>
            <b>Key Skills Overview:</b> A personalized breakdown of your skills
            based on your profile, backed by evidence from your tasks and strengths.
          </li>

          <li>
            <b>AI-Readiness Gap:</b> Clear insights into where your current skills
            stand in relation to the demands of an AI-dominated workplace.
          </li>
        </ul>

        <h3>2. Strategic Objectives</h3>

        <p>
          A custom roadmap tailored to your profile that outlines strategic
          objectives to close the AI-readiness gap.
        </p>

        <h3>3. Transformation Roadmap</h3>

        <ul>
          <li>
            <b>Capability Building:</b> Guidance on acquiring essential skills
            to remain competitive.
          </li>

          <li>
            <b>Tool Stack Recommendations:</b> Specific AI tools and platforms
            that align with your career goals.
          </li>

          <li>
            <b>30-Day Quick Start:</b> A step-by-step action plan to begin meeting
            your strategic objectives today.
          </li>
        </ul>

        <p class="cta">
          👉 <a href="${mailOptions.foboProUrl}" target="_blank">
            Access Your AI Action Plan Results
          </a>
        </p>

        <h3>What’s Next?</h3>

        <p>
          Your journey doesn’t stop here. Dive deeper into your AI Action Plan’s
          advanced analysis:
        </p>

        <ul>
          <li>
            <b>Skill Erosion Insights:</b> Identify skills at risk of becoming obsolete.
          </li>

          <li>
            <b>Task Automation Analysis:</b> Understand which tasks will likely
            be automated and how to adapt.
          </li>
        </ul>

        <h3>Share the Transformation</h3>

        <p>
          Know someone who could benefit from AI Action Plan?
          Share Altiv.AI with your network and help them get AI-ready too!
        </p>

        <p>
          Thank you for trusting us with your career transformation.
          The future is AI-driven, and you’re ready for it!
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
    subject: 'Welcome to AI Action Plan - Your Roadmap Awaits!',
    html: template,
  };
}