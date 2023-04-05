import { Router } from 'express';
import CarController from '../controllers/carController';

const carRouter = Router();

carRouter.post('/cars', CarController.createCar);

carRouter.put('/cars/:id', CarController.updateCarById);
carRouter.delete('/cars/:id', CarController.removeCarById);
carRouter.get('/cars/:id', CarController.getCarById);
carRouter.get('/cars', CarController.getCars);

export default carRouter;
