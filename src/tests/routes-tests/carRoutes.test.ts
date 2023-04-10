import request from 'supertest';
import { Router } from 'express';
import app from '../../app';
import {
  createCarController,
  listCarsController,
  removeCarController,
  updateCarController,
  getCarByIdController,
  updateAccessoryController,
} from '../../api/controllers/carController';
import validateID from '../../api/helpers/validateID';

jest.mock('../controllers/carController', () => ({
  createCarController: jest.fn(),
  listCarsController: jest.fn(),
  removeCarController: jest.fn(),
  updateCarController: jest.fn(),
  getCarByIdController: jest.fn(),
  updateAccessoryController: jest.fn(),
}));

describe('Car Router', () => {
  const carRouter = Router();

  beforeAll(() => {
    app.use(carRouter);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call createCarController when making POST request to /car', async () => {
    await request(app).post('/car').expect(200);
    expect(createCarController).toBeCalled();
  });

  it('should call validateID and updateCarController when making PUT request to /car/:id', async () => {
    await request(app).put('/car/123').expect(200);
    expect(validateID).toBeCalledWith('car');
    expect(updateCarController).toBeCalled();
  });

  it('should call validateID and removeCarController when making DELETE request to /car/:id', async () => {
    await request(app).delete('/car/123').expect(200);
    expect(validateID).toBeCalledWith('car');
    expect(removeCarController).toBeCalled();
  });

  it('should call validateID and getCarByIdController when making GET request to /car/:id', async () => {
    await request(app).get('/car/123').expect(200);
    expect(validateID).toBeCalledWith('car');
    expect(getCarByIdController).toBeCalled();
  });

  it('should call listCarsController when making GET request to /car', async () => {
    await request(app).get('/car').expect(200);
    expect(listCarsController).toBeCalled();
  });

  it('should call validateID and updateAccessoryController when making PATCH request to /car/:carId/accessories/:accessoryId', async () => {
    await request(app).patch('/car/123/accessories/456').expect(200);
    expect(validateID).toBeCalledWith('car');
    expect(updateAccessoryController).toBeCalled();
  });
});
