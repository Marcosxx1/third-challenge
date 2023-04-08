import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { createCar, listCars, removeCar, updateCar, getCarById } from '../services/carServices';
import handleErrorResponse from '../../helpers/errorHandler';

export const createCarController = async (req: Request, res: Response) => {
  try {
    const carData = req.body;
    const car = await createCar(carData);
    res.status(201).json(car);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const listCarsController = async (req: Request, res: Response) => {
  try {
    const { limit, offset, queryParams } = req.query;
    let parsedLimit = Number(limit);
    let parsedOffset = Number(offset);
    let parsedQueryParams: {
      model?: string;
      color?: string;
      year?: number;
      value_per_day?: number;
      accessories?: string[];
    } = {};

    if (isNaN(parsedLimit)) {
      parsedLimit = 100;
    }
    if (isNaN(parsedOffset)) {
      parsedOffset = 1;
    }

    if (typeof queryParams === 'string') {
      parsedQueryParams = JSON.parse(queryParams);
    }

    const cars = await listCars(parsedLimit, parsedOffset, parsedQueryParams);
    res.json(cars);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const removeCarController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await removeCar(id);
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

    const car = await updateCar(id, carData);

    res.json(car);
  } catch (error: any) {
    if (error.message === 'All fields are required') {
      res.status(400).json({ error: 'All fields are required' });
    } else if (error.message === 'Car not found') {
      res.status(404).json({ error: 'Car not found' });
    } else {
      handleErrorResponse(res, error);
    }
  }
};

export const getCarByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const car = await getCarById(id);
    if (!car) {
      res.status(404).json({ error: 'Car not found' });
    } else {
      res.json(car);
    }
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
