const jwt = require('jsonwebtoken');

const serverConfig = require('../configs/serverConfig');
const { HttpError } = require('../utils');

exports.signToken = (id) => jwt.sign({ id }, serverConfig.jwtSecret, {
  expiresIn: serverConfig.jwtExpires,
});

exports.checkToken = (token) => {
  if (!token) throw new HttpError(401, 'Not logged in...');

  try {
    const { id } = jwt.verify(token, serverConfig.jwtSecret);

    return id;
  } catch (err) {
    throw new HttpError(401, 'Not logged in...');
  }
};
