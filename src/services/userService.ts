import User, { IUser } from '../schemas/IUser';
import axios from 'axios';
import Joi, { ValidationResult } from 'joi';

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

    const userExists = await User.findOne({ $or: [{ cpf }, { email }] });
    if (userExists) {
      const field = userExists.cpf === cpf ? 'CPF' : 'email';
      throw { message: `User with this ${field} already exists` };
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

    return user;
  }

  async updateUser(id: string, userData: IUser): Promise<IUser> {
    const { name, cpf, birth, email, password, cep, qualified, patio, complement, neighborhood, locality, uf } =
      userData;

    const userExists = await User.findById(id);
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

    const updatedUser = await userExists.save();

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const userExists = await User.findById(id);
    if (!userExists) {
      throw { message: 'User not found' };
    }
    await userExists.deleteOne();
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw { message: 'User not found' };
    }
    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    const users = await User.find();
    return users;
  }
}

export default new UserService();
