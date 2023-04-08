import { Router } from 'express';
import ReservationController from '../api/controllers/reservationController';
import validateID from '../helpers/validateID';
import AuthController from '../api/controllers/authController';

const reservationController = new ReservationController();
const reservationRouter = Router();

const authController = new AuthController();

reservationRouter.post('/authenticate', authController.authenticate);

reservationRouter.post('/reserve', authController.protect, reservationController.createReservation);
reservationRouter.put(
  '/reserve/:id',
  authController.protect,
  validateID('reservation'),
  reservationController.updateReservationById,
);
reservationRouter.delete(
  '/reserve/:id',
  authController.protect,
  validateID('reservation'),
  reservationController.removeReservationById,
);
reservationRouter.get(
  '/reserve/:id',
  authController.protect,
  validateID('reservation'),
  reservationController.getReservationById,
);
reservationRouter.get('/reserve', authController.protect, reservationController.getReservationsController);

export default reservationRouter;
