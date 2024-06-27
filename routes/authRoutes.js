import express from 'express';
import AuthController from '../controllers/authController.js';
const router = express.Router();

const auth = new AuthController();

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/verifyEmail/:key', auth.verifyEmail);
router.post('/forgetPassword', auth.forgetPassword);
router.patch('/resetPassword/:token', auth.resetPassword);

export default router;
