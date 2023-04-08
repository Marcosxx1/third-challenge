import { Router } from 'express';
import ReservationController from '../api/controllers/reservationController';
import validateID from '../helpers/validateID';

const reservationController = new ReservationController();
const reservationRouter = Router();

reservationRouter.post('/reserve', reservationController.createReservation);
reservationRouter.put('/reserve/:id', validateID('reservation'), reservationController.updateReservationById);
reservationRouter.delete('/reserve/:id', validateID('reservation'), reservationController.removeReservationById);
reservationRouter.get('/reserve/:id', validateID('reservation'), reservationController.getReservationById);
reservationRouter.get('/reserve', reservationController.getReservationsController);

export default reservationRouter;
