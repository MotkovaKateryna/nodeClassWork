const { userServices, jwtServices } = require('../services');
const { userValidators, catchAsync, HttpError, logger } = require('../utils');

exports.checkSignupData = catchAsync(async (req, res, next) => {
  const { value, error } = userValidators.signupUserDataValidator(req.body);

  if (error) throw new HttpError(400, 'Invalid user data..', error);

  await userServices.checkUserExists({ email: value.email });

  req.body = value;

  next();
});

exports.checkLoginData = (req, res, next) => {
  const { value, error } = userValidators.loginUserDataValidator(req.body);

  if (error) {
    logger.error('Not authorised');
    throw new HttpError(401, 'Not authorized..', error);
  }

  req.body = value;

  next();
};

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1];

  const userId = jwtServices.checkToken(token);

  if (!userId) throw new HttpError(401, 'Not logged in ...');

  const currentUser = await userServices.getOneUser(userId);

  if (!currentUser) throw new HttpError(401, 'Not logged in ...');
  req.user = currentUser;

  next();
});

exports.allowFor = (...roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) return next();

  next(new HttpError(403, 'You are not allowed to perform this action.'));
};
