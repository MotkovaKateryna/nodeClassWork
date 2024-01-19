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

  if (error) throw new HttpError(400, 'Invalid user data!');

  await userServices.checkUserExists({ email: value.email, _id: { $ne: req.params.id } });

  req.body = value;

  next();
});

// Simple multer example
/*
// config storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cbfunc) => {
    cbfunc(null, 'public/images'); // cbfunc(error, 'path');
  },
  filename: (req, file, cbfunc) => {
    const extention = file.mimetype.split('/')[1]; // mimetype виглядає так "image/png"
    // конструкція посилання на файл аватару з прив'язкою до юзера(через id) <userId>-<random uuid>.<extention>
    cbfunc(null, `${req.user.id}-${uuid()}.${extention}`);
  }
});
// config filter
const multerFilter = (req, file, cbfunc) => {
  if (file.mimetype.startsWith('image/')) {
    cbfunc(null, true);
  } else {
    cbfunc(new HttpError(400, 'Please, upload images only!!!'), false);
  }
};

exports.uploadUserPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  }
}).single('avatar');
*/

exports.uploadUserPhoto = ImageService.initUploadMiddleware('avatar');
