import { Router } from 'express';
import UserController from '../api/controllers/userController';
//import authService from '../services/AuthService';

const userRouter = Router();

userRouter.post('/users', UserController.create);

userRouter.put('/users/:id', UserController.update);
userRouter.delete('/users/:id', UserController.delete);
userRouter.get('/users/:id', UserController.getById);
userRouter.get('/users', UserController.getAll);

/* userRouter.post('/authenticate', async (req, res) => {
  try {
    const authResult = await authService.authenticate(req);
    res.json(authResult);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});
 */
export default userRouter;
