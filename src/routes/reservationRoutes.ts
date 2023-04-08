import { Router } from 'express';

import AuthService from '../api/services/authService';
import handleErrorResponse from '../helpers/errorHandler';
import ReservationController from '../api/controllers/reservationController';

const reservationController = new ReservationController();
const reservationRouter = Router();
const authService = new AuthService();

reservationRouter.post('/reserve', reservationController.createReservation);
reservationRouter.put('/reserve/:id', reservationController.updateReservationById);
reservationRouter.delete('/reserve/:id', reservationController.removeReservationById);
reservationRouter.get('/reserve/:id', reservationController.getReservationById);
reservationRouter.get('/reserve', reservationController.getReservations);

export default reservationRouter;
