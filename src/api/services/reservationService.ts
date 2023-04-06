import IReservation from '../schemas/IReservation';
import Car from '../schemas/ICar';
import Reservation, { IReservationModel } from '../schemas/IReservation';
import moment from 'moment';

class ReservationService {
  async createReservation(reservationData: {
    id_user: string;
    start_date: Date;
    end_date: Date;
    id_car: string;
    final_value: number;
  }): Promise<IReservation> {
    const reservation = new Reservation(reservationData);
    await reservation.save();
    return reservation;
  }

  async getReservations(
    id_user: string,
    start_date: Date,
    end_date: Date,
    id_car: string,
    final_value: number,
    page: number,
    limit: number,
  ): Promise<{
    totalDocs: number;
    totalPages: number;
    queryResults: IReservation[];
  }> {
    const query: any = {};
    console.log('here ', id_user);

    if (id_user) {
      query.id_user = id_user;
    }
    if (start_date) {
      query.start_date = { $gte: start_date };
    }
    if (end_date) {
      query.end_date = { $lte: end_date };
    }
    if (id_car) {
      query.id_car = id_car;
    }
    if (final_value) {
      query.final_value = final_value;
    }

    const options = {
      page: parseInt(String(page)) || 1,
      limit: parseInt(String(limit)) || 10,
    };

    const reservations = await (Reservation as IReservationModel).paginate(query, options);
    return reservations;
  }

  async getReservationById(id: string): Promise<Reservation | null> {
    const reservation = await Reservation.findById(id).exec();
    return reservation;
  }

  // Update a reservation
  async updateReservation(id: string, reservationData: Partial<IReservation>): Promise<Reservation> {
    const reservation = await Reservation.findById(id).exec();

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservationData.id_user && reservationData.id_user !== reservation.id_user) {
      throw new Error('Cannot update id_user of a reservation');
    }

    if (reservationData.start_date && moment(reservationData.start_date).isBefore(moment())) {
      throw new Error('Cannot update past start_date of a reservation');
    }

    if (reservationData.id_car && reservationData.id_car !== reservation.id_car) {
      throw new Error('Cannot update id_car of a reservation');
    }

    if (reservationData.end_date && moment(reservationData.end_date).isBefore(moment())) {
      throw new Error('Cannot update past end_date of a reservation');
    }

    const car = await Car.findById(reservation.id_car).exec();
    if (car) {
      const nextDayReservation = await Reservation.findOne({
        id_car: reservation.id_car,
        start_date: { $gte: moment().add(1, 'day').startOf('day').toDate() },
      }).exec();

      if (nextDayReservation) {
        throw new Error('Cannot update reservation if car has reservation for next day');
      }
    }

    Object.assign(reservation, reservationData);
    await reservation.save();
    return reservation;
  }

  // Remove a reservation
  async removeReservation(id: string): Promise<void> {
    const reservation = await Reservation.findById(id).exec();
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    const car = await Car.findById(reservation.id_car).exec();
    if (car) {
      const nextDayReservation = await Reservation.findOne({
        id_car: reservation.id_car,
        start_date: { $gte: moment().add(1, 'day').startOf('day').toDate() },
      }).exec();

      if (nextDayReservation) {
        throw new Error('Cannot remove reservation if car has reservation for next day');
      }
    }

    await Reservation.findByIdAndRemove(id).exec();
  }
}

export default new ReservationService();
