import { Request, Response } from 'express';
import CarServices from '../services/carServices';
import handleErrorResponse from '../../helpers/errorHandler';

class CarController {
  async createCar(req: Request, res: Response): Promise<void> {
    try {
      const carData = req.body;
      const car = await CarServices.createCar(carData);
      res.json(car);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async getCars(req: Request, res: Response): Promise<void> {
    try {
      const { limit, offset, filters } = req.query;
      const cars = await CarServices.getCars(Number(limit), Number(offset), filters);
      res.json(cars);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async getCarById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log('here', id);
      const car = await CarServices.getCarById(id);
      if (car) {
        res.json(car);
      } else {
        handleErrorResponse(res, { message: 'Car not found' }, 404);
      }
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async updateCarById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const carData = req.body;
      const car = await CarServices.updateCarById(id, carData);
      if (car) {
        res.json(car);
      } else {
        handleErrorResponse(res, { message: 'Car not found' }, 404);
      }
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async removeCarById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await CarServices.removeCarById(id);
      res.status(204).send();
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
}

export default new CarController();
