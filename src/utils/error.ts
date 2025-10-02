import { Request, Response, NextFunction } from 'express';

export class HttpError extends Error {
  status: number;
  details?: any;
  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, 'Not Found'));
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const payload: any = {
    error: err.message || 'Error Interno del Servidor'
  };
  if (err.details) payload.details = err.details;
  res.status(status).json(payload);
}
