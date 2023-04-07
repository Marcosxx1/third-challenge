import { Response } from 'express';
import ReservationService from '../services/reservationService';
import handleErrorResponse from '../../helpers/errorHandler';

export default class ReservationController {
  private reservationService: ReservationService;

  constructor() {
    this.reservationService = new ReservationService();
  }

  async createReservation(
    id_user: string,
    start_date: string,
    end_date: string,
    id_car: string,
    res: Response,
  ): Promise<any> {
    try {
      return await this.reservationService.createReservation(id_user, start_date, end_date, id_car);
    } catch (error) {
      return handleErrorResponse(res, error, 500);
    }
  }

  async getReservations(page = 1, limit = 10, query = {}, res: Response) {
    try {
      return await this.reservationService.getReservations(page, limit, query);
    } catch (error) {
      return handleErrorResponse(res, error, 500);
    }
  }

  async getReservationById(id: string, res: Response) {
    try {
      return await this.reservationService.getReservationById(id);
    } catch (error) {
      return handleErrorResponse(res, error, 500);
    }
  }

  async updateReservationById(id: string, update: any, res: Response) {
    try {
      return await this.reservationService.updateReservationById(id, update);
    } catch (error) {
      return handleErrorResponse(res, error, 500);
    }
  }

  async removeReservationById(id: string, res: Response) {
    try {
      return await this.reservationService.removeReservationById(id);
    } catch (error) {
      return handleErrorResponse(res, error, 500);
    }
  }
}
