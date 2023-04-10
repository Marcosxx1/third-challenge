import { Router } from 'express';
import {
  createCarController,
  listCarsController,
  removeCarController,
  updateCarController,
  getCarByIdController,
  updateAccessoryController,
} from '../controllers/carController';
import validateID from '../helpers/validateID';

const carRouter = Router();

carRouter.post('/car', createCarController);

carRouter.put('/car/:id', validateID('car'), updateCarController);
carRouter.delete('/car/:id', validateID('car'), removeCarController);
carRouter.get('/car/:id', validateID('car'), getCarByIdController);
carRouter.get('/car', listCarsController);

carRouter.put('/car/:carId/accessories/:accessoryId', validateID('car'), updateAccessoryController);

export default carRouter;
