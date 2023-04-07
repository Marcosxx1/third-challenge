import { Request, Response } from 'express';
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
    let parsedQueryParams: {
      model?: string;
      color?: string;
      year?: number;
      value_per_day?: number;
      accessories?: string[];
    } = {};

    if (typeof queryParams === 'string') {
      parsedQueryParams = JSON.parse(queryParams);
    } else if (Array.isArray(queryParams)) {
    }

    const cars = await listCars(Number(limit), Number(offset), parsedQueryParams);
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
    const car = await updateCar(id, carData);
    res.json(car);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const getCarByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const car = await getCarById(id);
    res.json(car);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
