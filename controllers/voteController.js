import Factory from './handlerFactory.js';
import Vote from '../models/Vote.js';

import catchAsync from '../utils/catchAsync.js';
import Feedback from '../models/Feedback.js';

class VoteController extends Factory {
  constructor() {
    super(Vote);
  }

  toggleVote = catchAsync(async (req, res) => {
    if (!req.body.feedback) req.body.feedback = req.params.feedbackId;

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
