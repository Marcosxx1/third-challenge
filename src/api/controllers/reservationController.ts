import { Request, Response } from 'express';
import ReservationService from '../services/reservationService';
import handleErrorResponse from '../../helpers/errorHandler';

export default class ReservationController {
  private reservationService: ReservationService;

  constructor() {
    this.reservationService = new ReservationService();
  }

  createReservation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { start_date, end_date, id_car } = req.body;

      const id_user = '643097654dd974ea210af30b';

      const reservation = await this.reservationService.createReservation(id_user, start_date, end_date, id_car);
      res.status(201).json({ reservation });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  };

  getReservations = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, query } = req.query;
      const reservations = await this.reservationService.getReservations(Number(page), Number(limit), query);
      res.status(200).json({ reservations });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  };

  getReservationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const reservation = await this.reservationService.getReservationById(id);
      if (reservation) {
        res.status(200).json({ reservation });
      } else {
        res.status(404).json({ error: 'Reservation not found' });
      }
    } catch (error) {
      handleErrorResponse(res, error);
    }
  };

  updateReservationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const update = req.body;
      const reservation = await this.reservationService.updateReservationById(id, update);
      if (reservation) {
        res.status(200).json({ reservation });
      } else {
        res.status(404).json({ error: 'Reservation not found' });
      }
    } catch (error) {
      handleErrorResponse(res, error);
    }
  };

  removeReservationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.reservationService.removeReservationById(id);
      res.status(204).end();
    } catch (error) {
      handleErrorResponse(res, error);
    }
  };
}
