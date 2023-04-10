import { Router } from 'express';
import request from 'supertest';
import {
  createCarController,
  listCarsController,
  removeCarController,
  updateCarController,
  getCarByIdController,
  updateAccessoryController,
} from '../api/controllers/carController';
import validateID from '../api/helpers/validateID';

// Create a mock of the express Router
const carRouter = Router();

// Mock the express HTTP methods for testing
carRouter.post = jest.fn();
carRouter.put = jest.fn();
carRouter.delete = jest.fn();
carRouter.get = jest.fn();

// Define the test cases
describe('carRouter', () => {
  test('should call createCarController with POST /car', () => {
    expect(carRouter.post).toHaveBeenCalledWith('/car', createCarController);
  });

  test('should call updateCarController with PUT /car/:id', () => {
    expect(carRouter.put).toHaveBeenCalledWith('/car/:id', validateID('car'), updateCarController);
  });

  test('should call removeCarController with DELETE /car/:id', () => {
    expect(carRouter.delete).toHaveBeenCalledWith('/car/:id', validateID('car'), removeCarController);
  });

  test('should call getCarByIdController with GET /car/:id', () => {
    expect(carRouter.get).toHaveBeenCalledWith('/car/:id', validateID('car'), getCarByIdController);
  });

  test('should call listCarsController with GET /car', () => {
    expect(carRouter.get).toHaveBeenCalledWith('/car', listCarsController);
  });

  test('should call updateAccessoryController with PUT /car/:carId/accessories/:accessoryId', () => {
    expect(carRouter.put).toHaveBeenCalledWith(
      '/car/:carId/accessories/:accessoryId',
      validateID('car'),
      updateAccessoryController,
    );
  });
});
