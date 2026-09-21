import { describe, it, expect } from 'vitest';
import {
  bookAppointmentSchema,
  updateAppointmentSchema,
  listAppointmentsQuerySchema,
} from '@/lib/validation/appointment';

const validId = 'a'.repeat(24);

describe('bookAppointmentSchema', () => {
  const base = {
    doctorId: validId,
    date: '2025-01-06',
    slot: { startTime: '10:00', endTime: '10:30' },
  };

  it('accepts a valid in-person booking with a clinic', () => {
    const result = bookAppointmentSchema.safeParse({
      ...base,
      consultationType: 'in-person',
      clinicName: 'Apollo Clinic',
    });
    expect(result.success).toBe(true);
  });

  it('accepts an online booking without a clinic', () => {
    const result = bookAppointmentSchema.safeParse({
      ...base,
      consultationType: 'online',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an in-person booking without a clinic', () => {
    const result = bookAppointmentSchema.safeParse({
      ...base,
      consultationType: 'in-person',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid doctor id', () => {
    const result = bookAppointmentSchema.safeParse({
      ...base,
      doctorId: 'nope',
      consultationType: 'online',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a malformed time', () => {
    const result = bookAppointmentSchema.safeParse({
      ...base,
      slot: { startTime: '25:00', endTime: '10:30' },
      consultationType: 'online',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a malformed date', () => {
    const result = bookAppointmentSchema.safeParse({
      ...base,
      date: '06-01-2025',
      consultationType: 'online',
    });
    expect(result.success).toBe(false);
  });
});

describe('updateAppointmentSchema', () => {
  it('accepts a cancel action', () => {
    expect(updateAppointmentSchema.safeParse({ action: 'cancel' }).success).toBe(true);
  });

  it('accepts a reschedule with a new slot', () => {
    const result = updateAppointmentSchema.safeParse({
      action: 'reschedule',
      date: '2025-01-07',
      slot: { startTime: '11:00', endTime: '11:30' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects a reschedule missing the new slot', () => {
    const result = updateAppointmentSchema.safeParse({
      action: 'reschedule',
      date: '2025-01-07',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown action', () => {
    expect(updateAppointmentSchema.safeParse({ action: 'delete' }).success).toBe(false);
  });
});

describe('listAppointmentsQuerySchema', () => {
  it('applies defaults for page and limit', () => {
    const result = listAppointmentsQuerySchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  it('coerces numeric strings from query params', () => {
    const result = listAppointmentsQuerySchema.parse({ page: '2', limit: '5', status: 'booked' });
    expect(result).toEqual({ page: 2, limit: 5, status: 'booked' });
  });

  it('rejects an out-of-range limit', () => {
    expect(listAppointmentsQuerySchema.safeParse({ limit: '999' }).success).toBe(false);
  });
});
