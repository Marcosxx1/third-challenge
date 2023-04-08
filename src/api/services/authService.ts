import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import UserRepository from '../repositories/userRepository';
import handleErrorResponse from '../../helpers/errorHandler';

declare module 'express' {
  interface Request {
    user?: {
      email: string;
      userId: number;
    };
  }
}

class AuthService {
  private userRepository: typeof UserRepository;
  private JWT_SECRET_KEY: string;

  constructor() {
    this.userRepository = UserRepository;
    this.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'senhapadrao';
  }

  generateJwtToken(email: string, userId: number): string {
    const payload = { email, userId };
    const token = jwt.sign(payload, this.JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
  }

  validateJwtToken(token: string): { email: string; userId: number } | null {
    try {
      const payload = jwt.verify(token, this.JWT_SECRET_KEY) as { email: string; userId: number };
      return payload;
    } catch (error) {
      return null;
    }
  }

  authenticate(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      handleErrorResponse(res, { message: 'Unauthorized' }, 401);
      return;
    }

    const payload = this.validateJwtToken(token);
    if (!payload) {
      handleErrorResponse(res, { message: 'Invalid token' }, 401);
      return;
    }

    res.locals.user = payload; // Store the payload object in res.locals.user
    next();
  }
}

export default AuthService;

/* import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/userRepository';

class AuthService {
  private userRepository: typeof UserRepository;
  private JWT_SECRET_KEY: string;

  constructor() {
    this.userRepository = UserRepository;
    this.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'senhapadrao';
  }

  async authenticateUser(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.authenticate(email, password);

    if (user && typeof user === 'object' && user.password === password) {
      const token = this.generateJwtToken(user.email);
      return token;
    } else {
      return null;
    }
  }

  generateJwtToken(email: string): string {
    const payload = { email };
    const token = jwt.sign(payload, this.JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
  }

  validateJwtToken(token: string): object | null {
    try {
      const payload = jwt.verify(token, this.JWT_SECRET_KEY);
      return payload as object;
    } catch (error) {
      return null;
    }
  }
}

export default AuthService;
 */
