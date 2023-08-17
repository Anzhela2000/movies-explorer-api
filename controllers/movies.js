const mongoose = require('mongoose');
const { NotFoundError } = require('../errors/NotFoundError');
const { ValidationError } = require('../errors/ValidationError');
const Movie = require('../models/movie');
const { movieValidation } = require('../validation/movie');

const getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movies) => {
      res.send(movies);
    })
    .catch((next));
};

const postMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const userId = req.user._id;
  const { error } = movieValidation(req.body);
  if (error) {
    next(new ValidationError('Данные не прошли валидацию'));
  }
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: userId,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const movieId = req.params.id;
  const owner = req.user._id;
  Movie.findByIdAndRemove(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найдена.');
      } if (movie.owner.toString() !== owner) {
        throw new NotFoundError('Фильм недоступен для удаления.');
      } else {
        res.send(movie);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new ValidationError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
