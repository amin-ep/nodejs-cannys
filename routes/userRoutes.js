import express from 'express';
import UserController from '../controllers/userControler.js';
import { protect, allowedRoles } from '../middlewares/globalMiddlewares.js';
const router = express.Router();

const user = new UserController();

router.use(protect);
router.get('/me', user.getMe, user.getOne);
router.patch('/updateMe', user.updateMe);
router.delete('/deleteMe', user.deleteMe);
router.post('/updateMyPassword', user.updateMyPassword);

router.use(allowedRoles('admin'));
router.route('/').get(user.getAll);
router
  .route('/:id')
  .get(user.getOne)
  .patch(user.updateOne)
  .delete(user.deleteOne);

export default router;
