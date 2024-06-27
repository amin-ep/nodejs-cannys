import express from 'express';
import FeedbackController from '../controllers/feedbackController.js';
import {
  protect,
  protectUserField,
  allowedRoles,
} from '../middlewares/globalMiddlewares.js';
import voteRouter from './voteRoutes.js';
import commentRouter from './commentRoutes.js';

const feedback = new FeedbackController();

const router = express.Router();

router.use('/:feedbackId/votes', voteRouter);
router.use('/:feedbackId/comments', commentRouter);

router.route('/').get(feedback.getAll).post(protect, feedback.createOne);

router.use(protect);

router
  .route('/:id')
  .get(feedback.getOne)
  .patch(allowedRoles('admin'), protectUserField, feedback.updateOne)
  .delete(allowedRoles('admin'), feedback.deleteOne);

export default router;
