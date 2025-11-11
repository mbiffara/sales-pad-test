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
  return insertMessage({
    leadId,
    subject,
    body,
    channel,
    status: 'created',
    sentBy: 'system',
    sentAt: new Date(),
  });
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

export type CreateLeadReplyMessageInput = {
  leadId: number;
  subject: string;
  body: string;
  channel?: Message['channel'];
};

export const createLeadReplyMessage = async ({
  leadId,
  subject,
  body,
  channel = 'email',
}: CreateLeadReplyMessageInput): Promise<Message> => {
  return insertMessage({
    leadId,
    subject,
    body,
    channel,
    status: 'sent',
    sentBy: 'lead',
    sentAt: new Date(),
  });
};

type InsertMessageArgs = {
  leadId: number;
  subject: string;
  body: string;
  channel: Message['channel'];
  status: Message['status'];
  sentBy: Message['sentBy'];
  sentAt: Date;
};

const insertMessage = async ({
  leadId,
  subject,
  body,
  channel,
  status,
  sentBy,
  sentAt,
}: InsertMessageArgs): Promise<Message> => {
  const [message] = await db
    .insert(messages)
    .values({
      leadId,
      subject,
      body,
      channel,
      status,
      sentBy,
      sentAt,
    })
    .returning();

  return message;
};
