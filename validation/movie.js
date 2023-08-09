const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.movieValidation = (data) => {
  const schema = Joi.object({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    trailerLink: Joi.string().required().pattern(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    thumbnail: Joi.string().required().pattern(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    owner: Joi.objectId(),
    movieId: Joi.objectId(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  });

  return schema.validate(data);
};
