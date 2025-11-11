import { Request, Response } from 'express';

import { enqueueLeadReply } from '../jobs';

const cleanString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

export const postReply = async (req: Request, res: Response) => {
  const email = cleanString(req.body?.email)?.toLowerCase();
  const body = cleanString(req.body?.body);
  const subject = cleanString(req.body?.subject);

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  if (!body) {
    return res.status(400).json({ message: 'Body is required.' });
  }

  try {
    const jobId = await enqueueLeadReply({
      email,
      body,
      subject: subject ?? 'Lead reply',
    });

    return res
      .status(202)
      .json({ message: 'Reply job enqueued.', jobId, email });
  } catch (error) {
    console.error('Failed to enqueue reply job', error);
    return res.status(500).json({ message: 'Failed to enqueue reply job.' });
  }
};
