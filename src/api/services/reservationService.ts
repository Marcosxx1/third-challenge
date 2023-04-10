import Reservation, { IReservation } from '../schemas/IReservations';
import Car, { ICar } from '../schemas/ICar';

export default class ReservationService {
  async createReservation(
    id_user: string,
    start_date: string,
    end_date: string,
    id_car: string,
  ): Promise<IReservation> {
    const reservation: IReservation = new Reservation({ id_user, start_date, end_date, id_car });
    reservation.final_value = 0;
    await reservation.save();
    return reservation;
  }

  async getReservations(page = 1, limit = 10, query = {}) {
    try {
      const skip = (page - 1) * limit;
      const total = await Reservation.countDocuments(query);
      const reservations = await Reservation.find(query).skip(skip).limit(limit);
      return { total, page, limit, reservations };
    } catch (error) {
      throw error;
    }
  }

  async getReservationById(id: string) {
    return Reservation.findById(id);
  }

  updateReservation = async (id: string, start_date: string, end_date: string): Promise<IReservation | null> => {
    try {
      const reservation = await Reservation.findById(id);

      if (reservation) {
        const oldStartDate = reservation.start_date;
        const oldEndDate = reservation.end_date;
        const oldDaysDifference = Math.floor((oldEndDate.getTime() - oldStartDate.getTime()) / (1000 * 60 * 60 * 24));

        const newStartDate = new Date(start_date);
        const newEndDate = new Date(end_date);
        const currentDate = new Date();
        const car: ICar = await Car.findOne({ _id: reservation.id_car });


        if (!car) {
          throw new Error('Car not found');
        }

        console.log(currentDate);
        console.log(newEndDate);

        if (newStartDate < reservation.start_date) {
          throw new Error('New date must be greater than the initial one.');
        }

        if (newEndDate < newStartDate) {
          throw new Error('The end date cannot be before the start date.');
        }

        const daysDifference = Math.floor((newEndDate.getTime() - newStartDate.getTime()) / (1000 * 60 * 60 * 24));

        const fixedValue = car.value_per_day;
        let valorFinal = fixedValue * daysDifference;

        if (daysDifference > oldDaysDifference) {
          const daysAdded = daysDifference - oldDaysDifference;
          valorFinal += fixedValue * daysAdded;
        }

        reservation.start_date = newStartDate;
        reservation.end_date = newEndDate;
        reservation.final_value = valorFinal;

        await Reservation.updateOne({ _id: id }, { $set: reservation });

        return reservation;
      }

      return null;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  async removeReservationById(id: string) {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (id !== reservation.id) {
      throw new Error('Invalid reservation ID');
    }

    await Reservation.findByIdAndRemove(id);
  }
}
