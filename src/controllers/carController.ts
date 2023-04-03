import { Request, Response } from 'express';
import Joi from 'joi';
import Vehicle, { IVehicle } from '../models/IVehicle';

const carSchema = Joi.object({
  model: Joi.string().required(),
  color: Joi.string().required(),
  year: Joi.number().integer().min(1950).max(2023).required(),
  value_per_day: Joi.number().integer().min(1).required(),
  accessories: Joi.array()
    .items(
      Joi.object({
        description: Joi.string().required(),
      }),
    )
    .unique((a, b) => a.description === b.description)
    .min(1)
    .required(),
  number_of_passengers: Joi.number().integer().min(1).required(),
});

const idSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const getCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 10, offset = 0, offsets = 10, ...filters } = req.query;
    const query = filters;
    const cars = await Vehicle.find(query).skip(Number(offset)).limit(Number(limit));
    const total = await Vehicle.countDocuments(query);
    res.status(200).json({ cars, total, limit, offset, offsets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getCarById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = await idSchema.validateAsync(req.params);
    const car = await Vehicle.findById(id);
    if (!car) {
      res.status(404).json({ message: 'Car not found' });
    } else {
      res.status(200).json(car);
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid ID' });
  }
};

export const createCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { value, error } = carSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({ message: error.details.map((e) => e.message) });
    } else {
      const car = await Vehicle.create(value);
      res.status(201).json(car);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateCarById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = await idSchema.validateAsync(req.params);
    const { value, error } = carSchema.validate(req.body, { abortEarly: false });

    if (error) {
      res.status(400).json({ message: error.details.map((e) => e.message) });
    } else {
      const car = await Vehicle.findByIdAndUpdate(id, value, { new: true });
      if (!car) {
        res.status(404).json({ message: 'Car not found' });
      } else {
        res.status(200).json(car);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const removeCarById = async (req: Request, res: Response): Promise<void> => {
  try {
    const schema = Joi.object({
      id: Joi.string().required(),
    });

    const { id } = await schema.validateAsync(req.params);

    const deletedCar: IVehicle | null = await Vehicle.findByIdAndDelete(id);

    if (!deletedCar) {
      res.status(404).send({ message: 'Car not found' });
      return;
    }

    res.status(204).send();
  } catch (error: any) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
};
