import 'dotenv/config';
import { createServer } from 'node:http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { LocalStrategy } from './auth/strategy.js';
import { router as apiRouter } from './routes/api.js';
import { initSocket } from './socket/index.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    credentials: true,
  },
  connectionStateRecovery: {},
});
initSocket(io);

app.use(
  cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
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
    data: error.data || null,
  });
});

export default httpServer;
