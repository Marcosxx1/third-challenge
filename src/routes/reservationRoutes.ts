import { Router } from 'express';
import ReservationController from '../api/controllers/reservationController';

const reservationRouter = Router();

reservationRouter.post('/reservations', ReservationController.createReservation);

reservationRouter.get('/reservations', ReservationController.getReservations);
reservationRouter.get('/reservations/:id', ReservationController.getReservationById);
reservationRouter.put('/reservations/:id', ReservationController.updateReservation);
reservationRouter.delete('/reservations/:id', ReservationController.removeReservation);

export default reservationRouter;
