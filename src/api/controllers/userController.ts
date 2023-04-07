import { Request, Response } from 'express';
import User, { IUser } from '../schemas/IUser'; // Import the IUser interface
import handleErrorResponse from '../../helpers/errorHandler';
import UserService from '../services/userService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Import the necessary libraries for authentication

const userService = new UserService();

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

  async authenticate(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: 'Authentication failed. User not found.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Authentication failed. Invalid password.' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY ?? 'defaultSecret', { expiresIn: '1h' });

      return res.status(200).json({ user, token });
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  }
}

export default new UserController();
