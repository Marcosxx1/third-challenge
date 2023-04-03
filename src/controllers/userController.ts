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
}

export default new UserController();
