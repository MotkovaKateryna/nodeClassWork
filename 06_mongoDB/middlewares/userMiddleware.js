const { catchAsync, HttpError, userValidators } = require('../utils');
const { userServices } = require('../services');

exports.checkUserId = catchAsync(async (req, res, next) => {
  await userServices.checkUserExistsById(req.params.id);

  next();
});

exports.checkCreateUserData = catchAsync(async (req, res, next) => {
  const { value, error } = userValidators.createUserDataValidator(req.body);

  if (error) throw new HttpError(400, 'Invalid user data!');

  await userServices.checkUserExists({ email: value.email });

  req.body = value;

  next();
});

exports.checkUpdateUserData = catchAsync(async (req, res, next) => {
  const { value, error } = userValidators.updateUserDataValidator(req.body);

  if (error) throw new HttpError(400, 'Invalid user data!');

  await userServices.checkUserExists({ email: value.email, _id: { $ne: req.params.id } });

  req.body = value;

  next();
});
