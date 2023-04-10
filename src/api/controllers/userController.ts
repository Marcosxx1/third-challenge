import { Request, Response } from 'express';
import handleErrorResponse from '../helpers/errorHandler';
import UserService from '../services/userService';

const userService = new UserService();

class UserController {
  async create(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      return handleErrorResponse(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, cpf, birth, email, password, cep, qualified, patio, complement, neighborhood, locality, uf } =
        req.body;

      const updatedUser = await userService.updateUser(id, {
        name,
        cpf,
        birth,
        email,
        password,
        cep,
        qualified,
        patio,
        complement,
        neighborhood,
        locality,
        uf,
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await userService.deleteUser(id);

      return res.status(204).send();
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);

      return res.status(200).json(user);
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json(users);
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  }
}

export default new UserController();
