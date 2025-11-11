import { desc, eq } from 'drizzle-orm';

import { db } from '../db';
import { Job, jobs } from '../db/schema';

export type RecordJobInput = {
  bossJobId: string;
  leadId?: number;
  type: Job['type'];
  messageId?: number;
  details?: string;
};

export const recordJob = async ({
  bossJobId,
  leadId,
  type,
  messageId,
  details,
}: RecordJobInput): Promise<Job> => {
  const [job] = await db
    .insert(jobs)
    .values({
      bossJobId,
      leadId: leadId ?? null,
      type,
      messageId: messageId ?? null,
      status: 'queued',
      details: details ?? null,
    })
    .returning();

  return job;
};

type JobStatusUpdate = {
  messageId?: number;
  details?: string;
  leadId?: number;
};

export const updateJobStatus = async (
  bossJobId: string,
  status: Job['status'],
  updates: JobStatusUpdate = {},
): Promise<Job | undefined> => {
  const patch: Partial<typeof jobs.$inferInsert> = {
    status,
    updatedAt: new Date(),
  };

  if (updates.messageId !== undefined) {
    patch.messageId = updates.messageId;
  }

  if (updates.details !== undefined) {
    patch.details = updates.details;
  }

  if (updates.leadId !== undefined) {
    patch.leadId = updates.leadId;
  }

  const [job] = await db
    .update(jobs)
    .set(patch)
    .where(eq(jobs.bossJobId, bossJobId))
    .returning();

  return job;
};

export const listJobsByLeadId = async (leadId: number): Promise<Job[]> => {
  return db
    .select()
    .from(jobs)
    .where(eq(jobs.leadId, leadId))
    .orderBy(desc(jobs.createdAt));
};
