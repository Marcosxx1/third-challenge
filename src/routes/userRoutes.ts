import { Router } from 'express';
import UserController from '../controllers/userController';

const router = Router();

router.post('/users', UserController.create);

router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.delete);
router.get('/users/:id', UserController.getById);
router.get('/users', UserController.getAll);

export default router;
