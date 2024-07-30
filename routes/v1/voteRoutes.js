import express from 'express';
import VoteController from '../controllers/voteController.js';
import {
  protect,
  checkDocsOwner,
  setFeedbackIdOnBody,
  setUserOnBody,
  addValidator,
} from '../../middlewares/globalMiddlewares.js';
import Vote from '../../models/Vote.js';
import { voteValidator } from '../../validators/voteValidator.js';

const router = express.Router({ mergeParams: true });

const votes = new VoteController();

router.use(protect);
router
  .route('/')
  .get(votes.getAll)
  .post(
    addValidator(voteValidator),
    setFeedbackIdOnBody,
    setUserOnBody,
    votes.toggleVote,
  );
router
  .route('/:id')
  .get(votes.getOne)
  .delete(checkDocsOwner(Vote), votes.deleteOne);

export default router;
