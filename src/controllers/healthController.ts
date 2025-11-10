import { Request, Response } from 'express';

type HealthResponse = {
  status: 'ok';
  uptime: number;
  timestamp: string;
};

export const getHealth = (_req: Request, res: Response<HealthResponse>) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};
