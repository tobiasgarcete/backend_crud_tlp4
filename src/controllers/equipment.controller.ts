import { asyncHandler } from '../utils/asyncHandler.js';
import { listEquipment, getEquipment, createEquipment, updateEquipment, deleteEquipment, assignEquipment, transferEquipment, getStatusHistory } from '../services/equipment.service.js';

export const list = asyncHandler(async (req, res) => {
  const { q, page, pageSize, status, assignedToId } = req.query as any;
  const data = await listEquipment({
    q,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
    status,
    assignedToId
  });
  res.json(data);
});

export const getOne = asyncHandler(async (req, res) => {
  const data = await getEquipment(req.params.id);
  res.json(data);
});

export const create = asyncHandler(async (req, res) => {
  const eq = await createEquipment(req.body, req.user!.id);
  res.status(201).json(eq);
});

export const update = asyncHandler(async (req, res) => {
  const eq = await updateEquipment(req.params.id, req.body, req.user!.id);
  res.json(eq);
});

export const remove = asyncHandler(async (req, res) => {
  const result = await deleteEquipment(req.params.id);
  res.json(result);
});

export const assign = asyncHandler(async (req, res) => {
  const updated = await assignEquipment(req.params.id, req.body.userId, req.user!.id);
  res.json(updated);
});

export const transfer = asyncHandler(async (req, res) => {
  const updated = await transferEquipment(req.params.id, req.body.locationId, req.user!.id);
  res.json(updated);
});

export const history = asyncHandler(async (req, res) => {
  const h = await getStatusHistory(req.params.id);
  res.json(h);
});
