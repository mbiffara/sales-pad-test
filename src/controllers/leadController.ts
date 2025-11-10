import { Request, Response } from 'express';

import { createLead, getLeadById, LeadConflictError } from '../services/leadService';

const sanitizeString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

export const postLead = async (req: Request, res: Response) => {
  console.log('Received lead creation request:', req.body);
  const name = sanitizeString(req.body?.name);
  const email = sanitizeString(req.body?.email)?.toLowerCase();
  const phoneNumber = sanitizeString(req.body?.phoneNumber);

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  if (!email && !phoneNumber) {
    return res
      .status(400)
      .json({ message: 'Either email or phoneNumber must be provided.' });
  }

  try {
    const lead = await createLead({
      name,
      email,
      phoneNumber,
    });

    return res.status(201).json({ lead });
  } catch (error) {
    if (error instanceof LeadConflictError) {
      return res.status(409).json({ message: error.message, field: error.field });
    }

    console.error('Failed to create lead', error);
    return res.status(500).json({ message: 'Failed to create lead.' });
  }
};

export const getLead = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Lead id must be a positive integer.' });
  }

  try {
    const lead = await getLeadById(id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }

    return res.json({ lead });
  } catch (error) {
    console.error(`Failed to fetch lead ${id}`, error);
    return res.status(500).json({ message: 'Failed to fetch lead.' });
  }
};
