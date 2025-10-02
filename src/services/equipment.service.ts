import { HttpError } from '../utils/error.js';
import { EquipmentModel } from '../models/equipment.model.js';
import { StatusHistoryModel } from '../models/status-history.model.js';
import { Types } from 'mongoose';

type Status = 'IN_STOCK'|'ASSIGNED'|'REPAIR'|'RETIRED';

export async function listEquipment(query: { q?: string; page?: number; pageSize?: number; status?: Status; assignedToId?: string }) {
  const page = query.page && query.page > 0 ? query.page : 1;
  const pageSize = query.pageSize && query.pageSize > 0 ? Math.min(query.pageSize, 100) : 20;
  const filter: any = {};
  if (query.q) {
    filter.$or = [
      { assetTag: { $regex: query.q, $options: 'i' } },
      { serialNumber: { $regex: query.q, $options: 'i' } },
      { brand: { $regex: query.q, $options: 'i' } },
      { model: { $regex: query.q, $options: 'i' } },
      { category: { $regex: query.q, $options: 'i' } },
    ];
  }
  if (query.status) filter.status = query.status;
  if (query.assignedToId) filter.assignedToId = new Types.ObjectId(query.assignedToId);

  const [items, total] = await Promise.all([
    EquipmentModel.find(filter)
      .populate('assignedToId', 'email fullName role')
      .populate('locationId', 'code name')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    EquipmentModel.countDocuments(filter)
  ]);

  const mapped = items.map(i => ({
    id: i._id.toString(),
    ...i,
    assignedToId: i.assignedToId ? { id: i.assignedToId._id?.toString?.() ?? i.assignedToId, ...(i.assignedToId as any) } : null,
    locationId: i.locationId ? { id: (i.locationId as any)._id?.toString?.() ?? i.locationId, ...(i.locationId as any) } : null,
  }));

  return { items: mapped, page, pageSize, total, pages: Math.ceil(total / pageSize) };
}

export async function getEquipment(id: string) {
  const eq = await EquipmentModel.findById(id)
    .populate('assignedToId', 'email fullName role')
    .populate('locationId', 'code name')
    .lean();
  if (!eq) throw new HttpError(404, 'Equipment not found');
  return { id: eq._id.toString(), ...eq };
}

export async function createEquipment(data: any, userId: string) {
  // Unicidad manual + unique index en BD
  const dupTag = await EquipmentModel.findOne({ assetTag: data.assetTag }).lean();
  if (dupTag) throw new HttpError(409, 'assetTag already exists');
  const dupSerial = await EquipmentModel.findOne({ serialNumber: data.serialNumber }).lean();
  if (dupSerial) throw new HttpError(409, 'serialNumber already exists');

  const created = await EquipmentModel.create(data);
  await StatusHistoryModel.create({
    equipmentId: created._id,
    fromStatus: undefined,
    toStatus: created.status,
    note: 'Created',
    changedById: userId
  });
  return { id: created._id.toString(), ...created.toObject() };
}

export async function updateEquipment(id: string, data: any, userId: string) {
  const existing = await EquipmentModel.findById(id);
  if (!existing) throw new HttpError(404, 'Equipment not found');

  if (data.assetTag && data.assetTag !== existing.assetTag) {
    const dupTag = await EquipmentModel.findOne({ assetTag: data.assetTag }).lean();
    if (dupTag) throw new HttpError(409, 'assetTag already exists');
  }
  if (data.serialNumber && data.serialNumber !== existing.serialNumber) {
    const dupSerial = await EquipmentModel.findOne({ serialNumber: data.serialNumber }).lean();
    if (dupSerial) throw new HttpError(409, 'serialNumber already exists');
  }

  const prevStatus: Status = existing.status as Status;
  Object.assign(existing, data);
  await existing.save();

  if (data.status && data.status !== prevStatus) {
    await StatusHistoryModel.create({
      equipmentId: existing._id,
      fromStatus: prevStatus,
      toStatus: data.status,
      note: 'Status change',
      changedById: userId
    });
  }
  return { id: existing._id.toString(), ...existing.toObject() };
}

export async function deleteEquipment(id: string) {
  await StatusHistoryModel.deleteMany({ equipmentId: id });
  await EquipmentModel.findByIdAndDelete(id);
  return { ok: true };
}

export async function assignEquipment(id: string, userId: string, changedById: string) {
  const updated = await EquipmentModel.findByIdAndUpdate(
    id,
    { assignedToId: userId, status: 'ASSIGNED' },
    { new: true }
  );
  if (!updated) throw new HttpError(404, 'Equipment not found');
  await StatusHistoryModel.create({
    equipmentId: id,
    fromStatus: undefined,
    toStatus: 'ASSIGNED',
    note: `Assigned to ${userId}`,
    changedById
  });
  return { id: updated._id.toString(), ...updated.toObject() };
}

export async function transferEquipment(id: string, locationId: string, changedById: string) {
  const updated = await EquipmentModel.findByIdAndUpdate(
    id,
    { locationId, lastSeenAt: new Date() },
    { new: true }
  );
  if (!updated) throw new HttpError(404, 'Equipment not found');
  await StatusHistoryModel.create({
    equipmentId: id,
    fromStatus: updated.status,
    toStatus: updated.status,
    note: `Transferred to ${locationId}`,
    changedById
  });
  return { id: updated._id.toString(), ...updated.toObject() };
}

export async function getStatusHistory(id: string) {
  const history = await StatusHistoryModel.find({ equipmentId: id })
    .populate('changedById', 'email fullName')
    .sort({ changedAt: -1 })
    .lean();
  return history.map(h => ({ id: h._id.toString(), ...h }));
}
