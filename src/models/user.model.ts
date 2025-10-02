import mongoose, { Schema, InferSchemaType } from 'mongoose';

export type Role = 'ADMIN' | 'USER';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, enum: ['ADMIN','USER'], default: 'USER', index: true },
}, { timestamps: true });

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: string };

export const UserModel = mongoose.model('User', UserSchema);
