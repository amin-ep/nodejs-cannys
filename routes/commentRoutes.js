import express from 'express';
import CommentController from '../controllers/commentController.js';
import {
  protect,
  allowedRoles,
  protectUserField,
} from '../middlewares/globalMiddlewares.js';

const router = express.Router({ mergeParams: true });

const comment = new CommentController();

router.use(protect);
router
  .route('/')
  .get(comment.getAll)
  .post(
    allowedRoles('user', 'admin'),
    comment.checkParentCommentData,
    comment.createOne,
  );

router
  .route('/:id')
  .get(comment.getOne)
  .delete(comment.deleteOne)
  .patch(protectUserField, comment.updateOne);

export default router;
