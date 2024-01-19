const { Types } = require('mongoose');
const User = require('../models/userModel');
const { HttpError } = require('../utils');

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

exports.getAllUsers = () => User.find();
// or
// exports.getAllUsers = async () => {
//   const users = await User.find();

//   return users;
// };

exports.getOneUser = (id) => User.findById(id);

exports.updateUser = async (id, updateUserData) => {
  const user = await User.findById(id);

  Object.keys(updateUserData).forEach((key) => {
    user[key] = updateUserData[key];
  });

  return user.save();// метод що збереже все в БД
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
