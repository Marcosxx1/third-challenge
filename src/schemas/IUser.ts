import mongoose, { Schema, Document } from 'mongoose';
import Joi from 'joi';
import { cpf } from 'cpf-cnpj-validator';
import axios from 'axios';

interface IUser extends Document {
  name: string;
  cpf: string;
  birth: Date;
  email: string;
  password: string;
  cep: string;
  qualified: boolean;
  patio: string;
  complement: string;
  neighborhood: string;
  locality: string;
  uf: string;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    cpf: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value: string) => {
          return cpf.isValid(value);
        },
        message: 'Invalid CPF',
      },
    },
    birth: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => {
          const age = (Date.now() - new Date(value).getTime()) / (1000 * 3600 * 24 * 365);
          return age >= 18;
        },
        message: 'Must be at least 18 years old',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => {
          const result = Joi.string().email().validate(value);
          return result.error === undefined;
        },
        message: 'Invalid email',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    cep: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => {
          return /^\d{5}-\d{3}$/.test(value);
        },
        message: 'Invalid CEP',
      },
    },
    qualified: {
      type: Boolean,
      required: true,
      default: false,
    },
    patio: {
      type: String,
      required: true,
    },
    complement: {
      type: String,
    },
    neighborhood: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
      required: true,
    },
    uf: {
      type: String,
      required: true,
      uppercase: true,
      enum: [
        'AC',
        'AL',
        'AP',
        'AM',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MT',
        'MS',
        'MG',
        'PA',
        'PB',
        'PR',
        'PE',
        'PI',
        'RJ',
        'RN',
        'RS',
        'RO',
        'RR',
        'SC',
        'SP',
        'SE',
        'TO',
      ],
    },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>('save', async function () {
  const cep = this.cep.replace('-', '');
  const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
  this.patio = data.logradouro;
  this.complement = data.complemento;
  this.neighborhood = data.bairro;
  this.locality = data.localidade;
  this.uf = data.uf;
});

export default mongoose.model<IUser>('User', UserSchema);
