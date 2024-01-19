const { Types } = require('mongoose');
const User = require('../models/userModel');
const { HttpError } = require('../utils');
const { userRolesEnum } = require('../constants');
const { signToken } = require('./jwtServices');
const ImageService = require('./imageService');

/**
 * @param {Object} userData
 * @returns {Proimise<User>}
 * @category services
 * @author Kate
 */

exports.createUser = async (userData) => {
  const newUser = await User.create(userData);

  // 2 спосіб створити юзера
  // const newUser = new User(userData);
  // await newUser.save();

  newUser.password = undefined;

  return newUser;
};

exports.getAllUsers = () => User.find().lean();
// or
// exports.getAllUsers = async () => {
//   const users = await User.find();

//   return users;
// };

exports.getOneUser = (id) => User.findById(id);

exports.updateUser = async (id, updateUserData) => {
  const user = await User.findById(id).lean();

  Object.keys(updateUserData).forEach((key) => {
    user[key] = updateUserData[key];
  });

  return user.save(); // метод що збереже все в БД
};

exports.deleteUser = (id) => User.findByIdAndDelete(id);

exports.checkUserExists = async (filter) => {
  const userExists = await User.exists(filter);
  if (userExists) throw new HttpError(409, 'User exists!');
};

exports.checkUserExistsById = async (id) => {
  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) throw new HttpError(404, 'User not found...');

  const userExists = await User.exists({ _id: id });
  // const userExists = await User.findById(id);

  if (!userExists) throw new HttpError(404, 'User not found...');
};

exports.signup = async (data) => {
  const newUserData = {
    ...data,
    role: userRolesEnum.USER,
  };
  const newUser = await User.create(newUserData);
  newUser.password = undefined;

  const token = signToken(newUser.id);
  return { user: newUser, token };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new HttpError(401, 'Not authorized ...');

  const passwordIsValid = await user.checkPassword(password, user.password);

  if (!passwordIsValid) throw new HttpError(401, 'Not authorized ...');

  user.password = undefined;

  const token = signToken(user.id);
  return { user, token };
};

exports.updateMe = async (updateUserData, user, file) => {
  if (file) {
    // console.log(file);
    // user.avatar = file.path.replace('public', '');
    user.avatar = await ImageService.saveImage(
      file,
      { maxFileSize: 1.2, width: 100, height: 100 },
      'images',
      'users',
      user.id,
    );
  }
  Object.keys(updateUserData).forEach((key) => {
    user[key] = updateUserData[key];
  });
  return user.save();
};
