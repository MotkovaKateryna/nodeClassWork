const { Types } = require('mongoose');

const { User } = require('../models');
const { catchAsync, HttpError, userValidators } = require('../utils');

exports.checkUserId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) throw new HttpError(404, 'User not found...');

  const userExists = await User.exists({ _id: id });
  // const userExists = await User.findById(id);

  if (!userExists) throw new HttpError(404, 'User not found...');

  next();
});

exports.checkCreateUserData = catchAsync(async (req, res, next) => {
  const { value, error } = userValidators.createUserDataValidator(req.body);

  if (error) throw new HttpError(400, 'Invalid user data!');

  const userExists = await User.exists({ email: value.email });

  if (userExists) throw new HttpError(409, 'User with that email already exists...');

  req.body = value;

  next();
});
