import { IUser, UserModel } from "../models/user.model";

export class UserService {
  static async createUser(payload: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(payload);
    return user.save();
  }

  static async updateUser(
    id: string,
    payload: Partial<IUser>
  ): Promise<IUser | null> {
    if (!id) throw new Error("User ID is required for update");
    return UserModel.findByIdAndUpdate(id, payload, {
      new: true,
    }).exec();
  }

  static async getUserById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).exec();
  }
}
