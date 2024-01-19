const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const { userRouter } = require('./routes');

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? './envs/production.env' : './envs/development.env',
});

const app = express();

// MIDDLEWARES =========================
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(cors());

// custom global MW
app.use((req, res, next) => {
  console.log('Hello from middleware!!');

  req.time = new Date().toLocaleString('uk-UA');

  next();
});

// CONTROLLERS ===============================
app.get('/ping', (req, res) => {
  // res.sendStatus(201);
  // res.status(200).send('<h1>Hello from server =^^=</h1>');
  res.status(200).json({
    msg: 'pong!',
    date: req.time,
  });
});

// ROUTES ==========================
const pathPrefix = '/api/v1';

app.use(`${pathPrefix}/users`, userRouter);

/**
 * Handle 404 error
 */
app.all('*', (req, res) => {
  res.status(404).json({
    msg: 'Oops! Resource not found.',
  });
});

/**
 * Global error handler. 4 args required!!!!
 */
app.use((err, req, res, next) => {
  console.log('===================', err);

  res.status(err.status ?? 500).json({
    msg: err.message,
  });
});

// SERVER INIT =========================
const port = process.env.PORT ?? 4000;

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}..`);
});
