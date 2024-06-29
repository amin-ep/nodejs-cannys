import express from 'express';
import morgan from 'morgan';
import userRouter from './routes/userRoutes.js';
import globalErrorHandler from './errors/errorHandler.js';
import authRouter from './routes/authRoutes.js';
import feedbackRouter from './routes/feedbackRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import voteRouter from './routes/voteRoutes.js';
import HTTPError from './errors/httpError.js';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import helmet from 'helmet';

const app = express();

app.use(express.json());

// middlewares
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a',
});
app.use(morgan('combined', { stream: logStream }));
app.use(helmet());

const limiterMessage = 'To many requests. try again later!';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  statusCode: 429,
  message: limiterMessage,
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  message: limiterMessage,
  statusCode: 429,
  limit: 10,
});

app.use(limiter);
app.use('/api/v1/auth/login', loginLimiter);

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/feedback', feedbackRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/votes', voteRouter);

// Global error handler

app.all('*', function (req, res, next) {
  return next(
    new HTTPError(`This route is note defined! ${req.originalUrl}`, 404),
  );
});

app.use(globalErrorHandler);

export default app;
