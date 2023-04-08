import { Request, Response } from 'express';
import User, { IUser } from '../schemas/IUser';
import ReservationService from '../services/reservationService';
import handleErrorResponse from '../helpers/errorHandler';

export default class ReservationController {
  private reservationService: ReservationService;

  constructor() {
    this.reservationService = new ReservationService();
  }

  createReservation = async (req: Request, res: Response): Promise<void> => {
    try {
      const email: string = req.body.email;
      console.log(email);

      const user: IUser = await User.findOne({ email: email });

      if (!user) {
        throw new Error('User not found');
      }

      const userId: string = user.id;

      const reservation = await this.reservationService.createReservation(
        userId,
        req.body.start_date,
        req.body.end_date,
        req.body.id_car,
      );

      res.status(201).json({ reservation });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  };

  getReservationsController = async (req: Request, res: Response) => {
    try {
      const { page, limit, query } = req.query;
      let parsedPage = Number(page);
      let parsedLimit = Number(limit);

      if (isNaN(parsedPage) || parsedPage < 1) {
        parsedPage = 1;
      }

      if (isNaN(parsedLimit) || parsedLimit < 1) {
        parsedLimit = 10;
      }

      const reservations = await this.reservationService.getReservations(parsedPage, parsedLimit, query);
      res.status(200).json(reservations);
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
