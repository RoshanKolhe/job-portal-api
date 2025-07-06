module.exports = {
  apps: [
    {
      name: 'job-portal-api',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 5012
      }
    }
  ]
};
