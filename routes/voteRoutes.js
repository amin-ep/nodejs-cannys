import express from 'express';
import VoteController from '../controllers/voteController.js';
import { protectUserField, protect } from '../middlewares/globalMiddlewares.js';

const router = express.Router({ mergeParams: true });

const votes = new VoteController();

router.use(protect);
router.route('/').get(votes.getAll).post(votes.toggleVote);
router
  .route('/:id')
  .get(votes.getOne)
  .patch(protectUserField, votes.updateOne)
  .delete(votes.deleteOne);

export default router;
