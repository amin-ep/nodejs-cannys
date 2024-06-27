import Factory from './handlerFactory.js';
import Feedback from '../models/Feedback.js';
import {
  createFeedbackValidator,
  updateFeedbackValidator,
} from '../validators/feedbackValidator.js';

class FeedbackController extends Factory {
  constructor() {
    super(Feedback, createFeedbackValidator, updateFeedbackValidator);
  }

  // Midlewares
}

export default FeedbackController;
