const serverConfig = {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017',
  appName: process.env.PROJECT_NAME ?? 'Default name',
  port: process.env.PORT ? +process.env.PORT : 3000,
  environment: process.env.NODE_ENV ?? 'development',
  jwtSecret: process.env.JWT_SECRET ?? 'secret-phrase',
  jwtExpires: process.env.JWT_EXPIRES ?? '1d',
  emailFrom: process.env.EMAIL_FROM ?? 'admin@example.com',
  mailtrapUser: process.env.MAILTRAP_USER ?? '',
  mailrapPasswd: process.env.MAILTRAP_PASS ?? '',
  mailgunUser: process.env.MAILGUN_USER ?? '',
  mailgunPasswd: process.env.MAILGUN_PASS ?? '',
};

module.exports = serverConfig;
