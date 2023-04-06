import { Router } from 'express';
import CarController from '../controllers/carController';

const carRouter = Router();

carRouter.post('/car', CarController.createCar);

carRouter.put('/car/:id', CarController.updateCarById);
carRouter.delete('/car/:id', CarController.removeCarById);
carRouter.get('/car/:id', CarController.getCarById);
carRouter.get('/car', CarController.getCars);

export default carRouter;
