import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth.routes.js';
import equipmentRoutes from './routes/equipment.routes.js';
import userRoutes from './routes/user.routes.js';
import locationRoutes from './routes/location.routes.js';
import { notFound, errorHandler } from './utils/error.js';

export function createServer() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/api/health', (_, res) => res.json({ ok: true, service: 'FORMOTEX Inventory API (Mongo)' }));

  app.use('/api/auth', authRoutes);
  app.use('/api/equipment', equipmentRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/locations', locationRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
