/* import jwt from 'jsonwebtoken';
class AuthService {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async authenticate(req: any): Promise<{ token: string }> {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      throw new Error('Invalid username or password');
    }

    const token = jwt.sign({ userId: user._id }, this.secretKey, { expiresIn: '1d' });

    return { token };
  }
}

export default new AuthService(process.env.JWT_SECRET_KEY || 'secret');
 */
