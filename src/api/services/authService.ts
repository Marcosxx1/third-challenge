import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/userRepository';

class AuthService {
  private userRepository: typeof UserRepository;
  private JWT_SECRET_KEY: string;

  constructor() {
    this.userRepository = UserRepository;
    this.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'senhapadrao';
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
