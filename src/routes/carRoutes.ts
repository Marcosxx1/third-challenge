import { Router } from 'express';
import {
  createCarController,
  listCarsController,
  removeCarController,
  updateCarController,
  getCarByIdController,
} from '../api/controllers/carController';

const carRouter = Router();

carRouter.post('/car', createCarController);

carRouter.put('/car/:id', updateCarController);
carRouter.delete('/car/:id', removeCarController);
carRouter.get('/car/:id', getCarByIdController);
carRouter.get('/car', listCarsController);

export default carRouter;
