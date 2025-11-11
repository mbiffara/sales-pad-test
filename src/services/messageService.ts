import { eq } from 'drizzle-orm';

import { db } from '../db';
import { Message, messages } from '../db/schema';

export type CreateSystemMessageInput = {
  leadId: number;
  subject: string;
  body: string;
  channel?: Message['channel'];
};

export const createSystemMessage = async ({
  leadId,
  subject,
  body,
  channel = 'email',
}: CreateSystemMessageInput): Promise<Message> => {
  const [message] = await db
    .insert(messages)
    .values({
      leadId,
      subject,
      body,
      channel,
      status: 'created',
      sentBy: 'system',
    })
    .returning();

  return message;
};

export const markMessageSent = async (messageId: number): Promise<Message | undefined> => {
  const [message] = await db
    .update(messages)
    .set({
      status: 'sent',
      sentBy: 'system',
      sentAt: new Date(),
    })
    .where(eq(messages.id, messageId))
    .returning();

  return message;
};
