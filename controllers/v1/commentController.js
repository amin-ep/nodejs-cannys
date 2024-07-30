import Factory from './handlerFactory.js';
import Comment from '../../models/Comment.js';

import catchAsync from '../../utils/catchAsync.js';
import HTTPError from '../../errors/httpError.js';

class CommentController extends Factory {
  constructor() {
    super(Comment);
  }

  // Middleware
  checkParentCommentData = catchAsync(async (req, res, next) => {
    if (req.body.parentComment) {
      const comment = await Comment.findOne({ _id: req.body.parentComment });
      if (!comment) {
        return next(new HTTPError(`Invalid Id: ${req.body.parentComment}`));
      }
    }
    next();
  });

  protectPublishing(req, res, next) {
    if (req.body.published) {
      if (req.user.role === 'admin') {
        next();
      } else {
        return next(
          new HTTPError(
            "You don't have premission to performe this action!",
            403,
          ),
        );
      }
    }
  }
}

export default CommentController;
