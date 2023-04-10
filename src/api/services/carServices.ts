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
    model?: string,
    color?: string,
    year?: number,
    value_per_day?: number,
    accessories?: string[],
  ): Promise<any> {
    if (model === undefined || model === '') {
      const cars: ICar[] = await carRepository.listCars(limit, offset, model, color, year, value_per_day, accessories);
      throw new Error('Provide valid search parameters');
    } else {
      return await carRepository.listCars(limit, offset, model, color, year, value_per_day, accessories);
    }
  }

  static async getTotalCarCount(
    model?: string,
    color?: string,
    year?: number,
    value_per_day?: number,
    accessories?: string[],
  ): Promise<number> {
    return await carRepository.getTotalCarCount(model, color, year, value_per_day, accessories);
  }
  static async removeCar(id: string): Promise<void> {
    await carRepository.removeCar(id);
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

    if (!model || !color || !year || !value_per_day || !number_of_passengers) {
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
      number_of_passengers === null ||
      number_of_passengers === undefined
    ) {
      throw new Error('All fields are required');
    }

    if (!accessories || accessories.length === 0) {
      throw new Error('At least one accessory is required');
    }

    let car = await carRepository.getCarById(id);

    if (!car) {
      throw new Error('id not found');
    }

    car = await carRepository.updateCar(id, {
      model,
      color,
      year,
      value_per_day,
      accessories,
      number_of_passengers,
    });

    return car;
  }

  static async getCarById(id: string): Promise<ICar | null> {
    const car = await carRepository.getCarById(id);
    return car;
  }
}
