import userService from '../services/userService';
import { Request, Response } from 'express';
import User from '../schemas/IUser';

class UserController {
  async create(req: Request, res: Response) {
    try {
      const { user, token } = await userService.createUser(req.body);

      return res.status(201).json({ user, token });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, cpf, birth, email, password, cep, qualified, patio, complement, neighborhood, locality, uf } =
      req.body;

    try {
      const userExists = await User.findById(id);
      if (!userExists) {
        return res.status(404).json({ message: 'User not found' });
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
      return res.status(500).json({ message: 'Error updating user', error });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const userExists = await User.findById(id);
      if (!userExists) {
        return res.status(404).json({ message: 'User not found' });
      }

      await userExists.deleteOne();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting user', error });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Error getting user by id', error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Error getting all users', error });
    }
  }
}

export default new UserController();
