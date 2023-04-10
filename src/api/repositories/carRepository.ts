import Car, { ICar } from '../schemas/ICar';

class CarRepository {
  async createCar(carData: any): Promise<ICar> {
    const car = new Car(carData);
    await car.save();
    return car;
  }

  async listCars(
    limit: number,
    offset: number,
    model?: string,
    color?: string,
    year?: number,
    value_per_day?: number,
    accessories?: string[],
  ): Promise<any> {
    const query: any = {};

    if (model) {
      query.model = { $regex: new RegExp(model, 'i') };
    }
    if (color) {
      query.color = { $regex: new RegExp(color, 'i') };
    }
    if (year) {
      query.year = year;
    }
    if (value_per_day) {
      query.value_per_day = value_per_day;
    }
    if (accessories) {
      query.accessories = { $in: accessories };
    }

    const pageSize = limit;
    const skip = (offset - 1) * pageSize;

    const cars = await Car.find(query).skip(skip).limit(pageSize);
    return cars;
  }

  async getTotalCarCount(
    model?: string,
    color?: string,
    year?: number,
    value_per_day?: number,
    accessories?: string[],
  ): Promise<number> {
    const query: any = {};

    if (model) {
      query.model = { $regex: new RegExp(model, 'i') };
    }
    if (color) {
      query.color = { $regex: new RegExp(color, 'i') };
    }
    if (year) {
      query.year = year;
    }
    if (value_per_day) {
      query.value_per_day = value_per_day;
    }
    if (accessories) {
      query.accessories = { $in: accessories };
    }

    const totalCount = await Car.countDocuments(query);
    return totalCount;
  }

  async removeCar(id: string): Promise<void> {
    const car = await Car.findByIdAndRemove(id);
    if (!car) {
      throw new Error('Car not found');
    }
  }

  async updateCar(id: string, carData: any): Promise<ICar | null> {
    const car = await Car.findByIdAndUpdate(id, carData, { new: true });
    if (!car) {
      throw new Error('Car not found');
    }
    return car;
  }

  async getCarById(id: string): Promise<ICar | null> {
    const car = await Car.findById(id);
    if (!car) {
      throw new Error('Car not found');
    }
    return car;
  }
}

export default new CarRepository();
