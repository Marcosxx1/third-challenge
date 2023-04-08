import Reservation, { IReservation } from '../schemas/IReservations';

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
    const skip = (page - 1) * limit;
    const total = await Reservation.countDocuments(query);
    const reservations = await Reservation.find(query).skip(skip).limit(limit);
    return { total, page, limit, reservations };
  }

  async getReservationById(id: string) {
    return Reservation.findById(id);
  }

  async updateReservationById(id: string, update: any) {
    if (update.id_car && update.id_car !== id) {
      throw new Error('Cannot update reservation with different car ID');
    }

    const existingReservation = await Reservation.findOne({
      id_car: id,
      start_date: { $gt: new Date() },
    });
    if (existingReservation) {
      throw new Error('Cannot update reservation, car already has a reservation for the next day');
    }

    return Reservation.findByIdAndUpdate(id, update, { new: true });
  }

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
