import User, { IUser } from '../schemas/IUser';
import bcrypt from 'bcryptjs';

class UserRepository {
  async findById(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    return user;
  }

  async findOne(query: object): Promise<IUser | null> {
    const user = await User.findOne(query);
    return user;
  }

  async create(userData: IUser): Promise<IUser> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    userData.password = hashedPassword;
    const user = await User.create(userData);
    return user;
  }

  async update(id: string, userData: IUser): Promise<IUser | null> {
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      userData.password = hashedPassword;
    }
    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }

  async findAll(): Promise<IUser[]> {
    const users = await User.find();
    if (users.length === 0) {
      throw new Error('No users found');
    }
    return users;
  }
}

export default new UserRepository();
