import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './IUser';
import { ICar } from './ICar';

interface IReservation extends Document {
  id_user: string;
  start_date: Date;
  end_date: Date;
  id_car: string;
  final_value: number;
}

const ReservationSchema: Schema<IReservation> = new Schema<IReservation>(
  {
    id_user: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    id_car: {
      type: String,
      required: true,
    },
    final_value: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

// Validate user has a driver's license
ReservationSchema.pre<IReservation>('save', async function (next) {
  try {
    const User: Model<IUser> = mongoose.model('User');
    const user = await User.findById(this.id_user);
    if (!user || !user.has_driver_license) {
      return next(new Error("User must have a valid driver's license to make a reservation."));
    }
    next();
  } catch (err: any) {
    return next(err);
  }
});

// Prevent multiple reservations for the same car in the same day
ReservationSchema.pre<IReservation>('save', async function (next) {
  try {
    const Reservation: Model<IReservation> = mongoose.model('Reservation');
    const reservation = await Reservation.findOne({
      id_car: this.id_car,
      start_date: { $lte: this.end_date },
      end_date: { $gte: this.start_date },
    });
    if (reservation) {
      return next(new Error('Only one reservation allowed for the same car in the same day.'));
    }
    next();
  } catch (err: any) {
    return next(err);
  }
});

// Prevent multiple reservations in the same period by the same user
ReservationSchema.pre<IReservation>('save', async function (next) {
  try {
    const Reservation: Model<IReservation> = mongoose.model('Reservation');
    const reservation = await Reservation.findOne({
      id_user: this.id_user,
      start_date: { $lt: this.end_date },
      end_date: { $gt: this.start_date },
    });
    if (reservation) {
      return next(new Error('Only one reservation allowed in the same period by the same user.'));
    }
    next();
  } catch (err: any) {
    return next(err);
  }
});

// Calculate final_value based on value_per_day
ReservationSchema.pre<IReservation>('save', async function (next) {
  try {
    const Car = mongoose.model<ICar>('Car');
    const car = await Car.findById(this.id_car);
    if (!car || !car.value_per_day) {
      return next(new Error('Invalid car or missing value_per_day.'));
    }
    const days = Math.ceil((this.end_date.getTime() - this.start_date.getTime()) / (1000 * 60 * 60 * 24));
    this.final_value = car.value_per_day * days;
    next();
  } catch (err: any) {
    return next(err);
  }
});

export default mongoose.model<IReservation>('Reservation', ReservationSchema);
