import { Router, Response } from 'express';
import UserController from '../api/controllers/userController';
import AuthService from '../api/services/authService';
import handleErrorResponse from '../helpers/errorHandler';

const userRouter = Router();

const authService = new AuthService();

userRouter.post('/authenticate', async (req, res) => {
  try {
    const { email } = req.body;

    const token = await authService.generateJwtToken(email);
    //console.log('email: ', email, 'password: ', password, 'token: ', token);
    if (token) {
      res.json({ token });
    } else {
      handleErrorResponse(res, { message: 'Invalid email or password' }, 401);
    }
  } catch (error) {
    handleErrorResponse(res, error);
  }
});

userRouter.post('/users', UserController.create);
userRouter.put('/users/:id', UserController.update);
userRouter.delete('/users/:id', UserController.delete);
userRouter.get('/users/:id', UserController.getById);
userRouter.get('/users', UserController.getAll);

export default userRouter;
