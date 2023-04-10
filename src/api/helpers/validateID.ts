import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import CarModel from '../schemas/ICar';
import UserModel from '../schemas/IUser';
import ReservationModel from '../schemas/IReservations';

export const validateID = (schemaName: string) => async (req: Request, res: Response, next: NextFunction) => {
  const carId = req.params.carId;
  const accessoryId = req.params.accessoryId;
  console.log(req.params);
  console.log(accessoryId);

  try {
    let model;
    if (schemaName === 'car') {
      model = CarModel;
    } else if (schemaName === 'user') {
      model = UserModel;
    } else if (schemaName === 'reservation') {
      model = ReservationModel;
    } else {
      return res.status(400).json({ error: 'Invalid schema name' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default validateID;
