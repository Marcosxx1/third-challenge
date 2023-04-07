import User, { IUser } from '../schemas/IUser';

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
    const user = await User.create(userData);
    return user;
  }

  async update(id: string, userData: IUser): Promise<IUser | null> {
    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }

  async findAll(): Promise<IUser[]> {
    const users = await User.find();
    return users;
  }
}

export default new UserRepository();
