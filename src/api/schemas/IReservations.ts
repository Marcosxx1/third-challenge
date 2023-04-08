import mongoose, { Document, Schema, Model } from 'mongoose';
import { ICar } from './ICar';
import { IUser } from './IUser';

export interface IReservation extends Document {
  id_user: IUser['_id'];
  start_date: Date;
  end_date: Date;
  id_car: ICar['_id'];
  final_value: number;
}

const ReservationSchema: Schema<IReservation> = new Schema<IReservation>({
  id_user: { type: mongoose.Schema.Types.ObjectId, required: true },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  id_car: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  final_value: {
    type: Number,
    required: true,
  },
});

const Car: Model<ICar> = mongoose.model<ICar>('Vehicle');

const User: Model<IUser> = mongoose.model<IUser>('User');

class CustomError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

ReservationSchema.pre<IReservation>('save', async function () {
  const user = await User.findById(this.id_user);
  if (!user) {
    const error = new CustomError('User not found', 400);
    throw error;
  } else if (!user.qualified) {
    const error = new CustomError("User must have a driver's license to make a reservation", 400);
    throw error;
  }
});

ReservationSchema.pre<IReservation>('save', async function () {
  const Reservation: Model<IReservation> = mongoose.model('Reservation');
  const existingReservation = await Reservation.findOne({
    id_car: this.id_car,
    start_date: { $lt: this.end_date },
    end_date: { $gt: this.start_date },
  });
  if (existingReservation) {
    const error = new CustomError('There is already a reservation for this car on the same day', 400);
    throw error;
  }
});

ReservationSchema.pre<IReservation>('save', async function () {
  const Reservation: Model<IReservation> = mongoose.model('Reservation');
  const existingReservation = await Reservation.findOne({
    id_user: this.id_user,
    start_date: { $lt: this.end_date },
    end_date: { $gt: this.start_date },
  });
  if (existingReservation) {
    const error = new CustomError('There is already a reservation for this user in the same period', 400);
    throw error;
  }
});

ReservationSchema.statics.paginate = async function (query, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const total = await this.countDocuments(query);
  const reservations = await this.find(query).skip(skip).limit(limit);
  return { total, page, limit, reservations };
};

const Reservation: Model<IReservation> = mongoose.model<IReservation>('Reservation', ReservationSchema);

export default Reservation;
