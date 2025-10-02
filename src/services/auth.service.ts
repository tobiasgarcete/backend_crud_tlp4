import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { HttpError } from '../utils/error.js';
import { UserModel } from '../models/user.model.js';

export async function registerUser(data: { email: string; password: string; fullName: string; role: 'ADMIN'|'USER' }) {
  const existing = await UserModel.findOne({ email: data.email }).lean();
  if (existing) throw new HttpError(409, 'Email already registered');
  const salt = await bcrypt.genSalt(env.BCRYPT_SALT_ROUNDS);
  const passwordHash = await bcrypt.hash(data.password, salt);
  const user = await UserModel.create({ email: data.email, fullName: data.fullName, role: data.role, passwordHash });
  return { id: user._id.toString(), email: user.email, fullName: user.fullName, role: user.role };
}

export async function loginUser(email: string, password: string) {
  const user = await UserModel.findOne({ email });
  if (!user) throw new HttpError(401, 'Invalid credentials');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new HttpError(401, 'Invalid credentials');
  const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  return { token, user: { id: user._id.toString(), email: user.email, fullName: user.fullName, role: user.role } };
}
