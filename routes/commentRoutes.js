import express from 'express';
import CommentController from '../controllers/commentController.js';
import {
  protect,
  allowedRoles,
  protectUserField,
  checkDocsOwner,
  setFeedbackIdOnBody,
} from '../middlewares/globalMiddlewares.js';
import Comment from '../models/Comment.js';

const router = express.Router({ mergeParams: true });

const comment = new CommentController();

router.use(protect);
router
  .route('/')
  .get(comment.getAll)
  .post(
    allowedRoles('user'),
    comment.checkParentCommentData,
    setFeedbackIdOnBody,
    comment.createOne,
  );

router
  .route('/:id')
  .get(comment.getOne)
  .delete(checkDocsOwner(Comment), comment.deleteOne)
  .patch(protectUserField, checkDocsOwner(Comment), comment.updateOne);

export default router;
