import express from 'express';
import UserController from '../controllers/userControler.js';
import {
  protect,
  allowedRoles,
  addValidator,
} from '../../middlewares/globalMiddlewares.js';
import {
  changeMyPasswordValidator,
  updateMeValidator,
  updateUserValidator,
} from '../../validators/userValidator.js';

const router = express.Router();

const user = new UserController();

router.use(protect);
router.get('/me', user.getMe, user.getOne);
router.patch('/updateMe', addValidator(updateUserValidator), user.updateMe);
router.delete('/deleteMe', user.deleteMe);
router.patch(
  '/updateMyPassword',
  addValidator(changeMyPasswordValidator),
  user.updateMyPassword,
);

router.use(allowedRoles('admin'));
router.route('/').get(user.getAll);
router
  .route('/:id')
  .get(user.getOne)
  .patch(addValidator(updateMeValidator), user.updateOne)
  .delete(user.deleteOne);

export default router;
