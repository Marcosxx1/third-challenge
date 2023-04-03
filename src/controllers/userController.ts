import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/IUser';
import axios from 'axios';
import Joi from 'joi';

const secret = 'mysecretkey';

interface ITokenPayload {
  id: string;
  email: string;
  qualified: boolean;
}

function generateToken(payload: ITokenPayload) {
  return jwt.sign(payload, secret, { expiresIn: '1d' });
}
interface CreateUserRequest {
  name: string;
  cpf: string;
  birth: string;
  email: string;
  password: string;
  cep: string;
  qualified: boolean;
  patio?: string;
  complement?: string;
  neighborhood?: string;
  locality?: string;
  uf?: string;
}

const createUserSchema = Joi.object<CreateUserRequest>({
  name: Joi.string().required(),
  cpf: Joi.string()
    .pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)
    .required(),
  birth: Joi.date().max('now').iso().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  cep: Joi.string()
    .pattern(/^\d{5}-\d{3}$/)
    .required(),
  patio: Joi.string().required(),
  complement: Joi.string().required(),
  neighborhood: Joi.string().required(),
  locality: Joi.string().required(),
  uf: Joi.string().required(),
  qualified: Joi.boolean().required(),
});

class UserController {
  async create(req: Request, res: Response) {
    try {
      const { error, value } = createUserSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ message: 'Invalid input', errors: error.details });
      }

      const { name, cpf, birth, email, password, cep, qualified } = value;

      const userExists = await User.findOne({ $or: [{ cpf }, { email }] });
      if (userExists) {
        const field = userExists.cpf === cpf ? 'CPF' : 'email';
        return res.status(400).json({ message: `User with this ${field} already exists` });
      }

      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
      const { logradouro: patio, complemento: complement, bairro: neighborhood, localidade: locality, uf } = data;

      const user = await User.create({
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
      const token = generateToken({ id: user._id, email: user.email, qualified: user.qualified });

      return res.status(201).json({ user, token });
    } catch (error) {
      return res.status(500).json({ message: 'Error creating user', error });
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
