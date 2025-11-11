import { eq } from 'drizzle-orm';

import { db } from '../db';
import { Lead, leads } from '../db/schema';

export type CreateLeadInput = {
  name: string;
  email?: string;
  phoneNumber?: string;
};

export class LeadConflictError extends Error {
  constructor(public field: 'email' | 'phoneNumber') {
    super(
      field === 'email'
        ? 'A lead with this email already exists.'
        : 'A lead with this phone number already exists.',
    );
    this.name = 'LeadConflictError';
  }
}

export const createLead = async ({
  name,
  email,
  phoneNumber,
}: CreateLeadInput): Promise<Lead> => {
  if (email) {
    const existingEmail = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.email, email))
      .limit(1);

    if (existingEmail.length > 0) {
      throw new LeadConflictError('email');
    }
  }

  if (phoneNumber) {
    const existingPhone = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.phoneNumber, phoneNumber))
      .limit(1);

    if (existingPhone.length > 0) {
      throw new LeadConflictError('phoneNumber');
    }
  }

  const [lead] = await db
    .insert(leads)
    .values({
      name,
      email: email ?? null,
      phoneNumber: phoneNumber ?? null,
    })
    .returning();

  return lead;
};

export const getLeadById = async (id: number): Promise<Lead | undefined> => {
  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return lead;
};

export const getLeadByEmail = async (email: string): Promise<Lead | undefined> => {
  const normalizedEmail = email.trim().toLowerCase();
  const [lead] = await db
    .select()
    .from(leads)
    .where(eq(leads.email, normalizedEmail))
    .limit(1);
  return lead;
};
