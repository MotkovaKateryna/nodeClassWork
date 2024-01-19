const { userServices, Email } = require('../services');
const { catchAsync, logger } = require('../utils');

exports.signup = catchAsync(async (req, res) => {
  const { user, token } = await userServices.signup(req.body);

  try {
    await new Email(user, 'http://dummy.org').sendHello();
  } catch (err) {
    logger.warn(err.message);
  }

  res.status(201).json({
    msg: 'Success',
    user,
    token,
  });
});

exports.login = catchAsync(async (req, res) => {
  const { user, token } = await userServices.login(req.body);

  res.status(200).json({
    msg: 'Success',
    user,
    token,
  });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  // validate req.body
  const user = await userServices.getUserByEmail(req.body.email);

  if (!user) return res.status(200).json({ msg: 'Password reset instruction sent by email' });

  const otp = user.createPasswordResetToken();

  await user.save();

  console.log('>>>>>>>>>>>>>>>>>>>>>>>');
  console.log({ otp });
  console.log('<<<<<<<<<<<<<<<<<<<<<<<');

  // send otp via email
  try {
    // const resetUrl = `https://myFrontend/resetPassword/${otp}`;
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${otp}`;

    await new Email(user, resetUrl).sendPasswdReset();
    // const emailTransport = nodemailer.createTransport({
    //   // service: 'Sendgrid',
    //   host: 'sandbox.smtp.mailtrap.io',
    //   port: 2525,
    //   auth: {
    //     user: process.env.MAILTRAP_USER,
    //     pass: process.env.MAILTRAP_PASS,
    //   },
    // });

    // const emailConfig = {
    //   from: 'Todos app admin <admin@example.com>',
    //   to: 'test@example.com',
    //   subject: 'Password reset instruction',
    //   html: '<h1>Hello</h1>',
    //   text: 'Hello from todo app',
    // };

    // await emailTransport.sendMail(emailConfig);

    // send link in email
  } catch (err) {
    logger.err(err.message);

    user.passwordResetToken = undefined;
    user.passwordResetTokenExp = undefined;

    await user.save();
  }

  res.status(200).json({
    msg: 'Password reset instruction sent by email',
  });
});

exports.restorePassword = catchAsync(async (req, res) => {
  // should add password validation
  await userServices.resetPassword(req.params.otp, req.body.password);

  res.status(200).json({
    msg: 'Success',
  });
});
