const Joi = require('joi');

const { regex, userRolesEnum } = require('../constants');
const joiValidator = require('./joiValidator');

exports.createUserDataValidator = joiValidator((data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(3).max(30).required(),
      year: Joi.number().min(1900).max(new Date().getFullYear()),
      email: Joi.string().email().required(),
      password: Joi.string().regex(regex.PASSWD_REGEX).required(),
      role: Joi.string().valid(...Object.values(userRolesEnum)),
    })
    .validate(data));

exports.signupUserDataValidator = joiValidator((data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(3).max(30).required(),
      year: Joi.number().min(1900).max(new Date().getFullYear()),
      email: Joi.string().email().required(),
      password: Joi.string().regex(regex.PASSWD_REGEX).required()
    })
    .validate(data));

exports.loginUserDataValidator = joiValidator((data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().regex(regex.PASSWD_REGEX).required()
    })
    .validate(data));

exports.updateUserDataValidator = joiValidator((data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(3).max(30),
      year: Joi.number().min(1900).max(new Date().getFullYear()),
      email: Joi.string().email(),
      role: Joi.string().valid(...Object.values(userRolesEnum)),
    })
    .validate(data));
