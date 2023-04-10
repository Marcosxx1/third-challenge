import Car, { ICar, IAccessory } from '../schemas/ICar';
import carRepository from '../repositories/carRepository';

export default class CarService {
  static async createCar(carData: {
    model: string;
    color: string;
    year: number;
    value_per_day: number;
    accessories: IAccessory[];
    number_of_passengers: number;
  }): Promise<ICar> {
    const { model, color, year, value_per_day, accessories, number_of_passengers } = carData;

    const car = new Car({
      model,
      color,
      year,
      value_per_day,
      accessories,
      number_of_passengers,
    });

    await car.save();
    return car;
  }

  static async listCars(
    limit: number,
    offset: number,
    queryParams: { model?: string; color?: string; year?: number; value_per_day?: number; accessories?: string[] },
  ): Promise<{ cars: ICar[]; total: number; limit: number; offset: number }> {
    return await carRepository.listCars(limit, offset, queryParams);
  }

  static async removeCar(id: string): Promise<void> {
    await Car.findByIdAndRemove(id);
  }

  static async updateCar(
    id: string,
    carData: {
      model?: string;
      color?: string;
      year?: number;
      value_per_day?: number;
      accessories?: IAccessory[];
      number_of_passengers?: number;
    },
  ): Promise<ICar | null> {
    const { model, color, year, value_per_day, accessories, number_of_passengers } = carData;

    if (!model || !color || !year || !value_per_day || !accessories || !number_of_passengers) {
      throw new Error('All fields are required');
    }

    if (
      model === null ||
      model === undefined ||
      color === null ||
      color === undefined ||
      year === null ||
      year === undefined ||
      value_per_day === null ||
      value_per_day === undefined ||
      accessories === null ||
      accessories === undefined ||
      number_of_passengers === null ||
      number_of_passengers === undefined
    ) {
      throw new Error('All fields are required');
    }

    let car = await Car.findById(id);

    if (!car) {
      throw new Error('id not found');
    }

    car = await Car.findByIdAndUpdate(
      id,
      {
        model,
        color,
        year,
        value_per_day,
        accessories,
        number_of_passengers,
      },
      { new: true },
    );

    return car;
  }

  static async getCarById(id: string): Promise<ICar | null> {
    const car = await Car.findById(id);
    return car;
  }
}
