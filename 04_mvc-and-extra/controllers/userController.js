const uuid = require('uuid').v4;
const fs = require('fs').promises;

const { catchAsync, userValidators, HttpError } = require('../utils');

exports.createUser = catchAsync(async (req, res) => {
  const { value, error } = userValidators.createUserDataValidator(req.body);

  if (error) throw new HttpError(400, 'Invalid user data!');

  const { name, year } = value;

  const newUser = {
    name,
    year,
    id: uuid(),
  };

  // save to DB
  const usersDB = await fs.readFile('models.json');

  const users = JSON.parse(usersDB);

  users.push(newUser);

  await fs.writeFile('models.json', JSON.stringify(users));

  // response sending
  res.status(201).json({
    msg: 'Success!',
    user: newUser,
  });
});

exports.getUsers = catchAsync(async (req, res) => {
  const usersDB = await fs.readFile('models.json');

  const users = JSON.parse(usersDB);

  res.status(200).json({
    msg: 'Success!',
    users,
  });
});

exports.getUser = (req, res) => {
  res.status(200).json({
    msg: 'Success!',
    user: req.user,
  });
};
