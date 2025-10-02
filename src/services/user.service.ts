import { HttpError } from '../utils/error.js';
import { UserModel } from '../models/user.model.js';

export async function getMe(id: string) {
  const user = await UserModel.findById(id).select('email fullName role createdAt').lean();
  if (!user) throw new HttpError(404, 'User not found');
  return { id: user._id.toString(), ...user };
}

export async function listUsers() {
  const users = await UserModel.find().select('email fullName role createdAt').lean();
  return users.map(u => ({ id: u._id.toString(), email: u.email, fullName: u.fullName, role: u.role, createdAt: u.createdAt }));
}
