import Factory from './handlerFactory.js';
import Vote from '../models/Vote.js';
import { voteValidator } from '../validators/voteValidator.js';
import catchAsync from '../utils/catchAsync.js';
import HTTPError from '../errors/httpError.js';
import Feedback from '../models/Feedback.js';

class VoteController extends Factory {
  constructor() {
    super(Vote, voteValidator);
  }

  toggleVote = catchAsync(async (req, res, next) => {
    if (!req.body.feedback) req.body.feedback = req.params.feedbackId;

    if (!req.body.user) req.body.user = req.user.id;

    const { error } = voteValidator.validate(req.body);
    if (error) {
      return next(new HTTPError(error.message, 400));
    }

    const selectedFeedback = await Feedback.findOne({
      _id: req.body.feedback,
    }).populate({
      path: 'voters',
    });

    const voted = selectedFeedback.voters
      .map(el => el.user == req.user.id)
      .pop();
    if (voted) {
      await Vote.findOneAndDelete({ user: req.user.id });

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } else {
      const newVote = await Vote.create(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          vote: newVote,
        },
      });
    }
  });
}

export default VoteController;
