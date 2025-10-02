import mongoose, { Schema, InferSchemaType } from 'mongoose';

const EquipmentSchema = new Schema({
  assetTag: { type: String, required: true, unique: true, index: true },
  serialNumber: { type: String, required: true, unique: true, index: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['IN_STOCK','ASSIGNED','REPAIR','RETIRED'], default: 'IN_STOCK', index: true },
  purchaseDate: { type: Date },
  warrantyUntil: { type: Date },
  assignedToId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', index: true },
  lastSeenAt: { type: Date },
}, { timestamps: true });

export type EquipmentDoc = InferSchemaType<typeof EquipmentSchema> & { _id: string };

export const EquipmentModel = mongoose.model('Equipment', EquipmentSchema);
