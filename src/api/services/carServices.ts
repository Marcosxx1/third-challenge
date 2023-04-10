import Car, { ICar, IAccessory } from '../schemas/ICar';
import carRepository from '../repositories/carRepository';

export const createCar = async (carData: {
  model: string;
  color: string;
  year: number;
  value_per_day: number;
  accessories: IAccessory[];
  number_of_passengers: number;
}): Promise<ICar> => {
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
};

export const listCars = async (
  limit: number,
  offset: number,
  queryParams: { model?: string; color?: string; year?: number; value_per_day?: number; accessories?: string[] },
): Promise<{ cars: ICar[]; total: number; limit: number; offset: number }> => {
  const { model, color, year, value_per_day, accessories } = queryParams;

  return await carRepository.listCars(limit, offset, queryParams);
};

export const removeCar = async (id: string): Promise<void> => {
  await Car.findByIdAndRemove(id);
};

export const updateCar = async (
  id: string,
  carData: {
    model?: string;
    color?: string;
    year?: number;
    value_per_day?: number;
    accessories?: IAccessory[];
    number_of_passengers?: number;
  },
): Promise<ICar | null> => {
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
};

export const getCarById = async (id: string): Promise<ICar | null> => {
  const car = await Car.findById(id);
  return car;
};
