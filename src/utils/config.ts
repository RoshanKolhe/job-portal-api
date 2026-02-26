const SITE_SETTINGS = {
  email: {
    type: 'smtp',
    host: 'smtp.gmail.com',
    secure: false,
    port: 587,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: 'hello@altiv.ai',
      pass: 'bhhcgqinsevzcodl',
    },
  },
  fromMail: 'hello@altiv.ai',
};
export default SITE_SETTINGS;



