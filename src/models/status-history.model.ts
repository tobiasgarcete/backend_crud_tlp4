import mongoose, { Schema, InferSchemaType } from 'mongoose';

const StatusHistorySchema = new Schema({
  equipmentId: { type: Schema.Types.ObjectId, ref: 'Equipamento', required: true, index: true },
  fromStatus: { type: String, enum: ['IN_STOCK','ASSIGNED','REPAIR','RETIRED'], required: false },
  toStatus: { type: String, enum: ['IN_STOCK','ASSIGNED','REPAIR','RETIRED'], required: true },
  note: { type: String },
  changedAt: { type: Date, default: Date.now },
  changedById: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: false });

export type StatusHistoryDoc = InferSchemaType<typeof StatusHistorySchema> & { _id: string };

export const StatusHistoryModel = mongoose.model('Historial de estado', StatusHistorySchema);
