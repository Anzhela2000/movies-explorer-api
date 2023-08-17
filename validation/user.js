const Joi = require('joi');

exports.userValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).required(),
  });

  return schema.validate(data);
};
