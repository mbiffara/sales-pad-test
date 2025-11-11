import { desc, eq } from 'drizzle-orm';

import { db } from '../db';
import { Event, events } from '../db/schema';

export type EventType = Event['type'];

export type CreateEventInput = {
  leadId: number;
  type: EventType;
  data?: Record<string, unknown>;
};

export const recordEvent = async ({
  leadId,
  type,
  data,
}: CreateEventInput): Promise<Event> => {
  const [event] = await db
    .insert(events)
    .values({
      leadId,
      type,
      data: data ? JSON.stringify(data) : null,
    })
    .returning();

  return event;
};

export const listEventsByLeadId = async (leadId: number): Promise<Event[]> => {
  return db
    .select()
    .from(events)
    .where(eq(events.leadId, leadId))
    .orderBy(desc(events.createdAt));
};
