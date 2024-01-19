const { userServices } = require('../services');
const { catchAsync, logger } = require('../utils');

exports.signup = catchAsync(async (req, res) => {
  const { user, token } = await userServices.signup(req.body);

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

  if (!user) {
    return res.status(200).json({
      msg: 'Password reset instruction sent by email',
    });
  }

  const otp = user.createPasswordResetToken();

  // send otp(one time password) via email

  try {
    // const resetUrl = `https://myFrontend/resetPassword/${otp}`;
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${otp}`;

    // send link in email
  } catch (err) {
    logger.error(err.message);

    user.passwordResetToken = undefined;
    user.passwordResetTokenExp = undefined;

    await user.save();
  }
  res.status(200).json({
    msg: 'Password reset instruction sent by email',
  });
});
exports.restorePassword = catchAsync(async (req, res) => {
// shoul add password validation
  await userServices.resetPassword(req.params.otp, req.body.password);

  res.status(200).json({
    msg: 'Success',
  });
});
