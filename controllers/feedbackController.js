import Factory from './handlerFactory.js';
import Feedback from '../models/Feedback.js';

class FeedbackController extends Factory {
  constructor() {
    super(Feedback);
  }

  // Midlewares
}

export default FeedbackController;
