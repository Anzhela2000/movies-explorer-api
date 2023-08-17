const Error = (err, req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
};

module.exports = Error;
