import express from 'express';
import FeedbackController from '../controllers/feedbackController.js';
import {
  protect,
  protectUserField,
  checkDocsOwner,
  setImageOnBody,
  addValidator,
  setUserOnBody,
} from '../middlewares/globalMiddlewares.js';
import voteRouter from './voteRoutes.js';
import commentRouter from './commentRoutes.js';
import Feedback from '../models/Feedback.js';
import { uploadImage } from '../utils/uploadImage.js';
import {
  createFeedbackValidator,
  updateFeedbackValidator,
} from '../validators/feedbackValidator.js';

const feedback = new FeedbackController();

const router = express.Router();

router.use('/:feedbackId/votes', voteRouter);
router.use('/:feedbackId/comments', commentRouter);

router
  .route('/')
  .get(feedback.getAll)
  .post(
    protect,
    setUserOnBody,
    addValidator(createFeedbackValidator),
    uploadImage,
    setImageOnBody,
    feedback.createOne,
  );

router.use(protect);

router
  .route('/:id')
  .get(feedback.getOne)
  .patch(
    protectUserField,
    checkDocsOwner(Feedback),
    addValidator(updateFeedbackValidator),
    uploadImage,
    setImageOnBody,
    feedback.updateOne,
  )
  .delete(checkDocsOwner(Feedback), feedback.deleteOne);

export default router;
