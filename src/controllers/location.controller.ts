import { asyncHandler } from '../utils/asyncHandler.js';
import { createLocation, listLocations } from '../services/location.service.js';

export const create = asyncHandler(async (req, res) => {
  const loc = await createLocation(req.body);
  res.status(201).json(loc);
});

export const list = asyncHandler(async (_req, res) => {
  const locs = await listLocations();
  res.json(locs);
});
