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

// Calculate the final value based on the value_per_day
ReservationSchema.pre<IReservation>('save', async function () {
  const Car = mongoose.model('Car');
  const car = await Car.findById(this.id_car);
  const days = Math.ceil((this.end_date.getTime() - this.start_date.getTime()) / (1000 * 60 * 60 * 24));
  if (car && car.value_per_day) {
    this.final_value = car.value_per_day * days;
  } else {
    throw new Error("Car or car's value_per_day not found");
  }
});

ReservationSchema.pre<IReservation>('save', async function () {
  const User: Model<IUser> = mongoose.model('User');
  const user = await User.findById(this.id_user);
  if (user && !user.qualified) {
    throw new Error("User must have a driver's license to make a reservation");
  } else {
    throw new Error('User not found');
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
    throw new Error('There is already a reservation for this car on the same day');
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
    throw new Error('There is already a reservation for this user in the same period');
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
