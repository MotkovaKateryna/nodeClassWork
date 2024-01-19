const multer = require('multer');
const uuid = require('uuid').v4;

const { catchAsync, HttpError, userValidators } = require('../utils');
const { userServices, ImageService } = require('../services');

exports.checkUserId = catchAsync(async (req, res, next) => {
  await userServices.checkUserExistsById(req.params.id);

  next();
});

exports.checkCreateUserData = catchAsync(async (req, res, next) => {
  const { value, error } = userValidators.createUserDataValidator(req.body);

  if (error) throw new HttpError(400, 'Invalid user data!', error);

  await userServices.checkUserExists({ email: value.email });

  req.body = value;

  next();
});

exports.checkUpdateUserData = catchAsync(async (req, res, next) => {
  const { value, error } = userValidators.updateUserDataValidator(req.body);

  if (error) throw new HttpError(400, 'Invalid user data..');

  await userServices.checkUserExists({ email: value.email, _id: { $ne: req.params.id } });

  req.body = value;

  next();
});

exports.checkUpdateMyPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // validate new password (regexp)

  await userServices.checkUserPasswords(req.user.id, currentPassword, newPassword);

  next();
});

// SIMPLE MULTER EXAMPLE
// config storage
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cbk) => {
//     cbk(null, 'public/images');
//   },
//   filename: (req, file, cbk) => {
//     const extension = file.mimetype.split('/')[1]; // 'image/png'

//     // <userID>-<random uuid>.<extension>
//     cbk(null, `${req.user.id}-${uuid()}.${extension}`);
//   },
// });

// config filter
// const multerFilter = (req, file, cbk) => {
//   if (file.mimetype.startsWith('image/')) {
//     cbk(null, true);
//   } else {
//     cbk(new HttpError(400, 'Please, upload images only!!'), false);
//   }
// };

// exports.uploadUserPhoto = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
//   limits: {
//     fileSize: 2 * 1024 * 1024,
//   },
// }).single('avatar');

exports.uploadUserPhoto = ImageService.initUploadImageMiddleware('avatar');
