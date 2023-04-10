import { Router } from 'express';
import UserController from '../controllers/userController';
import { validateID } from '../helpers/validateID';

const userRouter = Router();

userRouter.post('/users', UserController.create);
userRouter.put('/users/:id', validateID('user'), UserController.update);
userRouter.delete('/users/:id', validateID('user'), UserController.delete);
userRouter.get('/users/:id', validateID('user'), UserController.getById);
userRouter.get('/users', UserController.getAll);

export default userRouter;
