import express from 'express';
import morgan from 'morgan';
import userRouter from './routes/userRoutes.js';
import globalErrorHandler from './errors/errorHandler.js';
import authRouter from './routes/authRoutes.js';
import feedbackRouter from './routes/feedbackRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import voteRouter from './routes/voteRoutes.js';
import HTTPError from './errors/httpError.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

app.use(express.json());

// __filename and __dirname are not available in ES6 modules, so we need to create them
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a',
});
app.use(morgan('combined', { stream: logStream }));

// app.use(
//   morgan(
//     ':method :url :status :res[content-length] - :response-time ms :date[web]',
//   ),
//   { stream: accessLogStream },
// );

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
