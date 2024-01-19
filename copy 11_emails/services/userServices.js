const { Types } = require('mongoose');
const crypto = require('crypto');

const User = require('../models/userModel');
const { HttpError, userNameHandler } = require('../utils');
const { userRolesEnum } = require('../constants');
const { signToken } = require('./jwtServices');
const ImageService = require('./imageService');

/**
 * Create user service
 * @param {Object} userData
 * @returns {Promise<User>}
 * @category services
 * @author Sergii
 */
exports.createUser = async (userData) => {
  const newUser = await User.create(userData);

  newUser.password = undefined;

  return newUser;
};

// exports.getAllUsers = () => User.find().select('+password').lean();
exports.getAllUsers = () => User.find().lean();

exports.getOneUser = (id) => User.findById(id);

exports.getUserByEmail = (email) => User.findOne({ email });

exports.updateUser = async (id, userData) => {
  const user = await User.findById(id).lean();

  Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });

  return user.save();
};

exports.deleteUser = (id) => User.findByIdAndDelete(id);

exports.checkUserExists = async (filter) => {
  const userExists = await User.exists(filter);

  if (userExists) throw new HttpError(409, 'User exists');
};

exports.checkUserExistsById = async (id) => {
  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) throw new HttpError(404, 'User not found..');

  const userExists = await User.exists({ _id: id });
  // const userExists = await User.findById(id);

  if (!userExists) throw new HttpError(404, 'User not found..');
};

exports.signup = async (data) => {
  const { name, ...restUserData } = data;
  const newUserData = {
    ...restUserData,
    name: userNameHandler(name),
    role: userRolesEnum.USER,
  };

  const newUser = await User.create(newUserData);

  newUser.password = undefined;

  const token = signToken(newUser.id);

  return { user: newUser, token };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new HttpError(401, 'Not authorized..');

  const passwdIsValid = await user.checkPassword(password, user.password);

  if (!passwdIsValid) throw new HttpError(401, 'Not authorized..');

  user.password = undefined;

  const token = signToken(user.id);

  return { user, token };
};

exports.updateMe = async (userData, user, file) => {
  if (file) {
    // user.avatar = file.path.replace('public', '');
    user.avatar = await ImageService.saveImage(
      file,
      { maxFileSize: 1.2, width: 100, height: 100 },
      'images',
      'users',
      user.id
    );
  }

  Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });

  return user.save();
};

exports.checkUserPasswords = async (id, currentPassword, newPassword) => {
  const currUser = await User.findById(id).select('+password');

  if (!(await currUser.checkPassword(currentPassword, currUser.password))) {
    throw new HttpError(401, 'Current password invalid!');
  }

  currUser.password = newPassword;

  await currUser.save();
};

exports.resetPassword = async (otp, newPassword) => {
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedOtp,
    passwordResetTokenExp: { $gt: Date.now() },
  });

  if (!user) throw new HttpError(400, 'Token is not valid');

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExp = undefined;

  await user.save();
};
