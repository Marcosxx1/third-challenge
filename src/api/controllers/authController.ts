import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../schemas/IUser';

export default class AuthController {
  authenticate = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ email }, process.env.JWT_SECRET ?? '', {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.status(200).json({
        token,
        data: {
          email: email,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);
    next();
  };
}
