import { Request, Response } from 'express';
import CarService from '../api/services/carServices';
import {
  createCarController /* 
  getCarByIdController,
  listCarsController,
  removeCarController,
  updateAccessoryController,
  updateCarController, */,
  listCarsController,
} from '../api/controllers/carController';

jest.mock('../api/services/carServices.ts', () => ({
  __esModule: true,
  default: {
    createCar: jest.fn().mockImplementation((carData: ICar) => {
      return Promise.resolve({
        ...carData,
        number_of_passengers: 4,
        limit: 100,
        offset: 1,
        $assertPopulated: () => { },
      });
    }),
  },
}));

interface ICar {
  _id: string;
  model: string;
  color: string;
  year: number;
  value_per_day: number;
  accessories: string[];
  number_of_passengers: number;
  limit: number;
  offset: number;
  $assertPopulated?: () => void;
}

describe('createCarController', () => {
  const mockRequest = {
    body: {
      model: 'Test Model',
      color: 'Test Color',
      year: 2022,
      value_per_day: 50,
      accessories: ['Test Accessory'],
    },
  } as Request;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  it('should handle errors and call the error handler', async () => {
    const mockError = new Error('Test error');

    jest.spyOn(CarService, 'createCar').mockRejectedValueOnce(mockError);

    await createCarController(mockRequest, mockResponse);

    expect(CarService.createCar).toHaveBeenCalledWith(mockRequest.body);
  });
});

describe('listCarsController', () => {
  let req: Request, res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      json: jest.fn(),
    } as unknown as Response;
  });

  it('should call CarService.listCars and CarService.getTotalCarCount with correct arguments', async () => {
    const limit = '10';
    const offset = '5';
    const model = 'Sedan';
    const color = 'Black';
    const year = '2020';
    const value_per_day = '50';
    const accessories = ['GPS', 'Bluetooth'];

    req.query = { limit, offset, model, color, year, value_per_day, accessories };

    await listCarsController(req, res);

    expect(CarService.listCars).toHaveBeenCalledWith(
      Number(limit),
      Number(offset),
      model,
      color,
      Number(year),
      Number(value_per_day),
      accessories,
    );

    expect(CarService.getTotalCarCount).toHaveBeenCalledWith(
      model,
      color,
      Number(year),
      Number(value_per_day),
      accessories,
    );
  });

  it('should return the correct JSON response when cars are found', async () => {
    const cars = [{ id: 1, model: 'SUV', color: 'White', year: 2021, value_per_day: 70 }];
    const totalCount = 1;
    const totalPages = 1;

    (CarService.listCars as jest.Mock).mockResolvedValue(cars);
    (CarService.getTotalCarCount as jest.Mock).mockResolvedValue(totalCount);

    await listCarsController(req, res);

    expect(res.json).toHaveBeenCalledWith({ cars, totalCount, totalPages });
  });

  it('should throw an error with status 400 when no cars are found', async () => {
    const error = { message: 'No cars found with the given search parameters', status: 400 };

    (CarService.listCars as jest.Mock).mockResolvedValue([]);

    await expect(listCarsController(req, res)).rejects.toEqual(error);
  });
});
