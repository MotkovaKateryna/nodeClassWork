const { catchAsync } = require('../utils');
const { userServices } = require('../services');

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
