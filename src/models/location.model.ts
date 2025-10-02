import mongoose, { Schema, InferSchemaType } from 'mongoose';

const LocationSchema = new Schema({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  notes: { type: String },
}, { timestamps: true });

export type LocationDoc = InferSchemaType<typeof LocationSchema> & { _id: string };

export const LocationModel = mongoose.model('ubicacion', LocationSchema);
