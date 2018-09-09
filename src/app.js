import { config } from 'dotenv';
config();

import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import winston from './config/winston';
import mongoose from 'mongoose';

import GameRouter from './routes/GameRouter';
import ChallengesRouter from './routes/ChallengesRouter';

// ------------- API Node Server Setup -------------
const app = express();
app.disable('x-powered-by');
app.use(logger('combined', { stream: winston.stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const BASE_URL = process.env.BASE_URL;
winston.info(`base URL is: ${BASE_URL}`);

// ------------- Game Router -------------
app.use(`${BASE_URL}/api/game`, GameRouter);
app.use(`${BASE_URL}/api/challenges`, ChallengesRouter);

// 404
app.use((req, res, next) => {
  winston.debug('404 catcher reached', req.url);
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  winston.error(`${req.ip} - ${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - `, err);

  // render the error page
  res.status(err.status || 500);
  res.send({
    error: res.locals.error,
    message: res.locals.message,
  });
});

app.listen(process.env.PORT, async () => {
  winston.info(`server listens to port ${process.env.PORT}`);

  // Connect to Mongo
  const mongoHost = process.env.NODE_ENV === 'production' ? 'mongo' : 'localhost';
  const mongoConnectionString = `mongodb://${mongoHost}/japanese`;
  winston.info(`connecting to Mongo at ${mongoConnectionString}`);
  try {
    const connected = await mongoose.connect(mongoConnectionString, { useNewUrlParser: true });
    const {
      host,
      name,
      port,
    } = connected.connection

    winston.info(`connected to mongo db "${name}" at ${host}:${port}`);
  } catch (err) {
    // console.log('error in mongo', e)
    winston.error(`mongo connection failed`, err);
  }

});
