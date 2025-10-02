import { asyncHandler } from '../utils/asyncHandler.js';
import { getMe, listUsers } from '../services/user.service.js';

export const me = asyncHandler(async (req, res) => {
  const user = await getMe(req.user!.id);
  res.json(user);
});

export const all = asyncHandler(async (_req, res) => {
  const users = await listUsers();
  res.json(users);
});
