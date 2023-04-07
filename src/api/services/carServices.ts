import Car, { ICar, IAccessory } from '../schemas/ICar';

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

  const query: any = {};
  if (model) query.model = model;
  if (color) query.color = color;
  if (year) query.year = year;
  if (value_per_day) query.value_per_day = value_per_day;
  if (accessories) query.accessories = { $in: accessories };

  const total = await Car.countDocuments(query);

  const cars = await Car.find(query).skip(offset).limit(limit).exec();

  return { cars, total, limit, offset };
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

  const car = await Car.findByIdAndUpdate(
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
