import ReservationService from '../services/reservationService';
import { Request, Response } from 'express';
import handleErrorResponse from '../../helpers/errorHandler';

class ReservationController {
  async createReservation(req: Request, res: Response): Promise<void> {
    try {
      const { id_user, start_date, end_date, id_car, final_value } = req.body;
      const reservationData = {
        id_user,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        id_car,
        final_value: Number(final_value),
      };
      const createdReservation = await ReservationService.createReservation(reservationData);
      res.json(createdReservation);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async getReservations(req: Request, res: Response): Promise<void> {
    try {
      const { id_user, start_date, end_date, id_car, final_value, page, limit } = req.query;
      const reservations = await ReservationService.getReservations(
        id_user as string,
        new Date(start_date as string),
        new Date(end_date as string),
        id_car as string,
        final_value as unknown as number,
        page as unknown as number,
        limit as unknown as number,
      );
      res.json(reservations);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async getReservationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reservation = await ReservationService.getReservationById(id);
      res.json(reservation);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async updateReservation(req: Request, res: Response): Promise<void> {
    try {
      const { id, ...reservationData } = req.body;
      const updatedReservation = await ReservationService.updateReservation(id, reservationData);
      res.json(updatedReservation);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async removeReservation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ReservationService.removeReservation(id);
      res.sendStatus(204);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
}

export default new ReservationController();
