const bcrypt = require('bcrypt');

const User = require('../models/userModel');
const { catchAsync } = require('../utils');
const { userServices } = require('../services');

exports.createUser = catchAsync(async (req, res) => {
  // const { password, ...restUserData } = req.body;
  // const salt = await bcrypt.genSalt(10);
  // const passwHash = await bcrypt.hash(password, salt);
  // const passwHash = await bcrypt.hash(password, 10);
  // const passwordValid = await bcrypt.compare('Pass_1289', passwHash);

  const newUser = await userServices.createUser(req.body);

  // response sending
  res.status(201).json({
    msg: 'Success!',
    user: newUser,
  });
});

exports.getUsers = catchAsync(async (req, res) => {
  // const users = await User.find();
  // const users = await User.find().select('+password');
  // const users = await User.find().select('name year');
  const users = await userServices.getAllUsers();

  res.status(200).json({
    msg: 'Success!',
    users,
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await userServices.getOneUser(req.params.id);

  // const passIsValid = await user.checkPassword('Pass_6371', '$2b$10$hswHvaYwwshziP6MkkTDl.hPEsp6saPTFZjzYUrsmUOK2k6eUzA6G');

  // console.log('||============>>>>>>>>>>');
  // console.log(passIsValid);
  // console.log('<<<<<<<<<<============||');

  res.status(200).json({
    msg: 'Success!',
    user,
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  // const { id } = req.params;
  // const { name, year, role } = req.body;

  // const updateUser = await User.findByIdAndUpdate(id, { name, year, role }, { new: true });
  const updatedUser = await userServices.updateUser(req.params.id, req.body);

  res.status(200).json({
    msg: 'Success!',
    user: updatedUser,
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  // const { id } = req.params;
  // await User.findByIdAndDelete(id);
  await userServices.deleteUser(req.params.id);

  // res.status(200).json({
  //   msg: 'Success!',
  //   user,
  // });
  res.sendStatus(204);
});

exports.getMe = (req, res) => {
  res.status(200).json({
    msg: 'Success!',
    user: req.user,
  });
};

exports.updateMe = catchAsync(async (req, res) => {
  const updateUser = await userServices.updateMe(req.body, req.user, req.file);
  res.status(200).json({
    msg: 'Success!',
    user: updateUser,
  });
});
