const Joi = require('joi');

exports.createUserDataValidator = (data) =>
  Joi
    .object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(3).max(12).required(),
      year: Joi.number().min(1900).max(new Date().getFullYear()),
    })
    .validate(data);

exports.updateUserDataValidator = (data) =>
  Joi
    .object()
    .keys({
      name: Joi.string().min(3).max(12).required(),
      year: Joi.number().min(1900).max(new Date().getFullYear()),
    })
    .validate(data);
