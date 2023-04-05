import { Router } from 'express';
import UserController from '../controllers/userController';

const userRouter = Router();

userRouter.post('/users', UserController.create);

userRouter.put('/users/:id', UserController.update);
userRouter.delete('/users/:id', UserController.delete);
userRouter.get('/users/:id', UserController.getById);
userRouter.get('/users', UserController.getAll);

export default userRouter;
