const smtpHost = process.env.SMTP_HOST || 'smtp-relay.gmail.com';
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = process.env.SMTP_SECURE === 'true';
const smtpRequireTLS = process.env.SMTP_REQUIRE_TLS !== 'false';
const smtpRejectUnauthorized = process.env.SMTP_REJECT_UNAUTHORIZED === 'true';
const smtpClientName = process.env.SMTP_CLIENT_NAME || 'altiv.ai';
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';

const SITE_SETTINGS = {
  email: {
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    requireTLS: smtpRequireTLS,
    tls: {
      rejectUnauthorized: smtpRejectUnauthorized,
    },
    name: smtpClientName,
    ...(smtpUser && smtpPass
      ? {
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        }
      : {}),
  },
  fromMail: process.env.FROM_EMAIL || smtpUser || 'hello@altiv.ai',
};
export default SITE_SETTINGS;



