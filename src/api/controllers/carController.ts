import { Request, Response } from 'express';
import mongoose from 'mongoose';
import handleErrorResponse from '../helpers/errorHandler';
import CarService from '../services/carServices';

export const createCarController = async (req: Request, res: Response) => {
  try {
    const carData = req.body;
    const car = await CarService.createCar(carData);
    res.status(201).json(car);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const listCarsController = async (req: Request, res: Response) => {
  try {
    const { limit, offset, model, color, year, value_per_day, accessories } = req.query;

    let parsedLimit = Number(limit);
    let parsedOffset = Number(offset);

    if (isNaN(parsedLimit)) {
      parsedLimit = 100;
    }
    if (isNaN(parsedOffset)) {
      parsedOffset = 1;
    }

    const cars = await CarService.listCars(parsedLimit, parsedOffset, model, color, year, value_per_day, accessories);

    if (cars.length === 0) {
      throw { message: 'No cars found with the given search parameters', status: 400 };
    }

    const totalCount = await CarService.getTotalCarCount(model, color, year, value_per_day, accessories);
    const totalPages = Math.ceil(totalCount / parsedLimit);

    res.json({ cars, totalCount, totalPages });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const removeCarController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await CarService.removeCar(id);
    res.sendStatus(204);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const updateCarController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const carData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const car = await CarService.updateCar(id, carData);

    res.json(car);
  } catch (error: any) {
    handleErrorResponse(res, error);
  }
};

export const getCarByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const car = await CarService.getCarById(id);
    if (!car) {
      res.status(404).json({ error: 'Car not found' });
    } else {
      res.json(car);
    }
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
