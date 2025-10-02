import { HttpError } from '../utils/error.js';
import { LocationModel } from '../models/location.model.js';

export async function createLocation(data: { code: string; name: string; notes?: string }) {
  const dup = await LocationModel.findOne({ code: data.code }).lean();
  if (dup) throw new HttpError(409, 'ubicacion ya existente');
  const loc = await LocationModel.create(data);
  return { id: loc._id.toString(), code: loc.code, name: loc.name, notes: loc.notes };
}

export async function listLocations() {
  const locs = await LocationModel.find().sort({ name: 1 }).lean();
  return locs.map(l => ({ id: l._id.toString(), code: l.code, name: l.name, notes: l.notes }));
}
