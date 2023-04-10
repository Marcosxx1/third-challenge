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
    queryParams: { model?: string; color?: string; year?: number; value_per_day?: number; accessories?: string[] },
  ): Promise<{ cars: ICar[]; total: number; limit: number; offset: number }> {
    const { model, color, year, value_per_day, accessories } = queryParams;

    const query: any = {};
    if (model) query.model = model;
    if (color) query.color = color;
    if (year) query.year = year;
    if (value_per_day) query.value_per_day = value_per_day;
    if (accessories) query.accessories = { $in: accessories };

    const total = await Car.countDocuments(query);

    const cars = await Car.find(query).skip(offset).limit(limit).exec();
    console.log('carRepository  limit:', limit, 'offset: ', offset);

    return { cars, total, limit, offset };
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
