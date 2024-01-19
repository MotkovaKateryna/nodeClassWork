const { catchAsync } = require('../utils');
const { userServices } = require('../services');

exports.createUser = catchAsync(async (req, res) => {
  // const { password, ...restUserData } = req.body;
  // const salt = await bcrypt.genSalt(10);
  // const passwdHash = await bcrypt.hash(password, salt);
  // const passwordValid = await bcrypt.compare('Pass_1234', passwdHash);

  const newUser = await userServices.createUser(req.body);

  res.status(201).json({
    msg: 'Success!',
    user: newUser,
  });
});

exports.getUsers = catchAsync(async (req, res) => {
  // const users = await User.find().select('+password');
  // const users = await User.find().select('-email');
  // const users = await User.find().select('name year');
  // const users = await User.find();

  const users = await userServices.getAllUsers();

  res.status(200).json({
    msg: 'Success!',
    users,
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await userServices.getOneUser(req.params.id);

  res.status(200).json({
    msg: 'Success!',
    user,
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  // const updatedUser = await User.findByIdAndUpdate(id, { name, year, role }, { new: true });
  const updatedUser = await userServices.updateUser(req.params.id, req.body);

  res.status(200).json({
    msg: 'Success!',
    user: updatedUser,
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await userServices.deleteUser(req.params.id);

  res.sendStatus(204);
});

exports.getMe = (req, res) => {
  res.status(200).json({
    msg: 'Success!',
    user: req.user,
  });
};

exports.updateMe = catchAsync(async (req, res) => {
  const updatedUser = await userServices.updateMe(req.body, req.user, req.file);

  res.status(200).json({
    msg: 'Success!',
    user: updatedUser,
  });
});
