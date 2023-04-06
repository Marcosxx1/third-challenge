import Joi from 'joi';
import Car, { ICar } from '../schemas/ICar';

const carSchema = Joi.object({
  model: Joi.string().required(),
  color: Joi.string().required(),
  year: Joi.number().integer().min(1950).max(2023).required(),
  value_per_day: Joi.number().integer().min(1).required(),
  accessories: Joi.array()
    .items(
      Joi.object({
        description: Joi.string().required(),
      }),
    )
    .unique((a, b) => a.description === b.description)
    .min(1)
    .required(),
  number_of_passengers: Joi.number().integer().min(1).required(),
});

const idSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});

class CarServices {
  async createCar(carData: ICar): Promise<ICar> {
    const { value } = carSchema.validate(carData, { abortEarly: false });
    const car = await Car.create(value);
    return car;
  }

  async getCars(
    limit: number,
    offset: number,
    filters: any,
  ): Promise<{ cars: ICar[]; total: number; limit: number; offset: number; offsets: number }> {
    const query = filters;
    const cars = await Car.find(query).skip(Number(offset)).limit(Number(limit));
    const total = await Car.countDocuments(query);
    return { cars, total, limit, offset, offsets: 10 };
  }

  async getCarById(id: string): Promise<ICar | null> {
    const { id: carId } = await idSchema.validateAsync({ id });
    const car = await Car.findById(carId);
    return car;
  }

  async updateCarById(id: string, carData: ICar): Promise<ICar | null> {
    const { id: carId } = await idSchema.validateAsync({ id });
    const { value } = carSchema.validate(carData, { abortEarly: false });
    const car = await Car.findByIdAndUpdate(carId, value, { new: true });
    return car;
  }

  async removeCarById(id: string): Promise<void> {
    const { id: carId } = await idSchema.validateAsync({ id });
    await Car.findByIdAndRemove(carId);
  }
}

export default new CarServices();
