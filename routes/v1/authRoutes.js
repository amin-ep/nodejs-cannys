import express from 'express';
import AuthController from '../../controllers/v1/authController.js';
import { addValidator } from '../../middlewares/globalMiddlewares.js';
import {
  registerValidator,
  forgetPasswordValidator,
  loginValidator,
} from '../../validators/authValidator.js';
const router = express.Router();

const auth = new AuthController();

router.post('/register', addValidator(registerValidator), auth.register);
router.post('/login', addValidator(loginValidator), auth.login);
router.post('/verifyEmail/:key', auth.verifyEmail);
router.post(
  '/forgetPassword',
  addValidator(forgetPasswordValidator),
  auth.forgetPassword,
);
router.patch('/resetPassword/:token', auth.resetPassword);

export default router;
