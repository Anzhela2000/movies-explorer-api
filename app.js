require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB, SERVER_PORT } = require('./config');

const { NOT_FOUND_ERROR_CODE } = require('./errors/NotFoundError');

const {
  register, login,
} = require('./controllers/users');

const app = express();

mongoose.connect(DB);

app.use('/', bodyParser.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use(requestLogger);

app.post('/signup', register);
app.post('/signin', login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой страницы нет' });
});

app.use(errorLogger);

app.use(errors);

app.listen(SERVER_PORT);
