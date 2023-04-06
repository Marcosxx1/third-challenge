import userService from '../services/userService';
import { Request, Response } from 'express';
import User from '../schemas/IUser';
import handleErrorResponse from '../../helpers/errorHandler';

class UserController {
  async create(req: Request, res: Response) {
    try {
      const { user, token } = await userService.createUser(req.body);

      return res.status(201).json({ user, token });
    } catch (error: any) {
      return handleErrorResponse(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, cpf, birth, email, password, cep, qualified, patio, complement, neighborhood, locality, uf } =
        req.body;

      const userExists = await User.findById(id);
      if (!userExists) {
        return handleErrorResponse(res, { message: 'User not found' }, 404);
      }

      userExists.name = name;
      userExists.cpf = cpf;
      userExists.birth = birth;
      userExists.email = email;
      userExists.password = password;
      userExists.cep = cep;
      userExists.qualified = qualified;
      userExists.patio = patio;
      userExists.complement = complement;
      userExists.neighborhood = neighborhood;
      userExists.locality = locality;
      userExists.uf = uf;

      const updatedUser = await userExists.save();

      return res.status(200).json(updatedUser);
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const userExists = await User.findById(id);
      if (!userExists) {
        return handleErrorResponse(res, { message: 'User not found' }, 404);
      }

      await userExists.deleteOne();

      return res.status(204).send();
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) {
        return handleErrorResponse(res, { message: 'User not found' }, 404);
      }

      return res.status(200).json(user);
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  }
}

export default new UserController();