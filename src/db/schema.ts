import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const leads = pgTable(
  'leads',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }),
    phoneNumber: varchar('phone_number', { length: 32 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex('lead_email_unique').on(table.email),
    phoneIdx: uniqueIndex('lead_phone_unique').on(table.phoneNumber),
  }),
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export const messageSender = pgEnum('message_sender', ['system', 'lead']);
export const messageChannel = pgEnum('message_channel', ['email']);
export const messageStatus = pgEnum('message_status', ['created', 'sent']);

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  leadId: integer('lead_id')
    .notNull()
    .references(() => leads.id, { onDelete: 'cascade' }),
  subject: varchar('subject', { length: 255 }).notNull(),
  body: text('body').notNull(),
  channel: messageChannel('channel').default('email').notNull(),
  status: messageStatus('status').default('created').notNull(),
  sentBy: messageSender('sent_by').default('system').notNull(),
  sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export const jobType = pgEnum('job_type', [
  'send_lead_message',
  'lead_reply_message',
  'ai_reply_message',
]);

export const jobStatus = pgEnum('job_status', [
  'queued',
  'processing',
  'completed',
  'failed',
  'skipped',
]);

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  bossJobId: varchar('boss_job_id', { length: 128 }).notNull(),
  leadId: integer('lead_id').references(() => leads.id, { onDelete: 'cascade' }),
  messageId: integer('message_id').references(() => messages.id, {
    onDelete: 'set null',
  }),
  type: jobType('type').notNull(),
  status: jobStatus('status').default('queued').notNull(),
  details: text('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
