import { Router } from 'express';
import ReservationController from '../controllers/reservationController';
import validateID from '../helpers/validateID';
import AuthController from '../controllers/authController';

const reservationController = new ReservationController();
const reservationRouter = Router();

const authController = new AuthController();

reservationRouter.post('/authenticate', authController.authenticate);

reservationRouter.post('/reserve', authController.passToken, reservationController.createReservation);
reservationRouter.put(
  '/reserve/:id',
  authController.passToken,
  validateID('reservation'),
  reservationController.updateReservationById,
);
reservationRouter.delete(
  '/reserve/:id',
  authController.passToken,
  validateID('reservation'),
  reservationController.removeReservationById,
);
reservationRouter.get(
  '/reserve/:id',
  authController.passToken,
  validateID('reservation'),
  reservationController.getReservationById,
);
reservationRouter.get('/reserve', authController.passToken, reservationController.getReservationsController);

export default reservationRouter;
