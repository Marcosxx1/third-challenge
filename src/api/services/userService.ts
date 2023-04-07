import Joi from 'joi';
import UserRepository from '../repositories/userRepository';
import { IUser } from '../schemas/IUser';
import axios from 'axios';

interface CreateUserInput {
  name: string;
  cpf: string;
  birth: string;
  email: string;
  password: string;
  cep: string;
  qualified: boolean;
}

class UserService {
  private createUserSchema: Joi.ObjectSchema<CreateUserInput>;

  constructor() {
    this.createUserSchema = Joi.object({
      name: Joi.string().required(),
      cpf: Joi.string()
        .pattern(/^\d{3}.\d{3}.\d{3}-\d{2}$/)
        .required(),
      birth: Joi.date().max('now').iso().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      cep: Joi.string()
        .pattern(/^\d{5}-\d{3}$/)
        .required(),
      qualified: Joi.boolean().required(),
    });
  }

  async createUser(userData: CreateUserInput): Promise<IUser> {
    const { error, value } = this.createUserSchema.validate(userData, { abortEarly: false });
    if (error) {
      throw { message: 'Invalid input', errors: error.details };
    }
    const { name, cpf, birth, email, password, cep, qualified } = value;

    const userExists = await UserRepository.findOne({ $or: [{ cpf }, { email }] });
    if (userExists) {
      const field = userExists.cpf === cpf ? 'CPF' : 'email';
      throw { message: `User with this ${field} already exists` };
    }

    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
    const { logradouro: patio, complemento: complement, bairro: neighborhood, localidade: locality, uf } = data;

    const user = await UserRepository.create({
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

    return user;
  }

  async updateUser(id: string, userData: IUser): Promise<IUser> {
    const { name, cpf, birth, email, password, cep, qualified, patio, complement, neighborhood, locality, uf } =
      userData;

    const userExists = await UserRepository.findById(id);
    if (!userExists) {
      throw { message: 'User not found' };
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

    const updatedUser = await UserRepository.update(id, userExists);

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const userExists = await UserRepository.findById(id);
    if (!userExists) {
      throw { message: 'User not found' };
    }
    await UserRepository.delete(id);
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw { message: 'User not found' };
    }
    return user;
  }

  async getAllUsers(): Promise<Array<IUser>> {
    const users = await UserRepository.findAll();
    return users;
  }
}

export default UserService;
