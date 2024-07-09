import express from 'express';
import CommentController from '../controllers/commentController.js';
import {
  protect,
  allowedRoles,
  protectUserField,
  checkDocsOwner,
  setFeedbackIdOnBody,
  addValidator,
} from '../middlewares/globalMiddlewares.js';
import Comment from '../models/Comment.js';
import {
  createCommentValidator,
  updateCommentValidator,
} from '../validators/CommentValidator.js';

const router = express.Router({ mergeParams: true });

const comment = new CommentController();

router.use(protect);
router
  .route('/')
  .get(comment.getAll)
  .post(
    addValidator(createCommentValidator),
    allowedRoles('user'),
    comment.checkParentCommentData,
    setFeedbackIdOnBody,
    comment.createOne,
  );

router
  .route('/:id')
  .get(comment.getOne)
  .delete(checkDocsOwner(Comment), comment.deleteOne)
  .patch(
    addValidator(updateCommentValidator),
    protectUserField,
    checkDocsOwner(Comment),
    comment.updateOne,
  );

export default router;
