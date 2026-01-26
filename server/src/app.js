import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { LocalStrategy } from './auth/strategy.js';
import { router as apiRouter } from './routes/api.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
passport.use(LocalStrategy);

app.use('/api', apiRouter);

app.use((req, res, next) => {
  const error = new Error('Oops... You seem lost.');
  error.statusCode = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Something went wrong on the server.',
  });
});

export default app;
