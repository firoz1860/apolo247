import { z } from 'zod';

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid id');

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD');

const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be HH:MM (24h)');

export const timeSlotSchema = z.object({
  startTime: timeString,
  endTime: timeString,
});

export const consultationTypeSchema = z.enum(['online', 'in-person', 'home']);

export const bookAppointmentSchema = z
  .object({
    doctorId: objectId,
    date: dateString,
    slot: timeSlotSchema,
    consultationType: consultationTypeSchema,
    clinicName: z.string().min(1).optional(),
  })
  .refine(
    (data) => data.consultationType === 'online' || Boolean(data.clinicName),
    { message: 'clinicName is required for in-person and home visits', path: ['clinicName'] }
  );

export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;

export const rescheduleSchema = z.object({
  action: z.literal('reschedule'),
  date: dateString,
  slot: timeSlotSchema,
});

export const cancelSchema = z.object({
  action: z.literal('cancel'),
});

export const updateAppointmentSchema = z.discriminatedUnion('action', [
  cancelSchema,
  rescheduleSchema,
]);

export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;

export const appointmentStatuses = ['booked', 'cancelled', 'completed'] as const;
export const listAppointmentsQuerySchema = z.object({
  status: z.enum(appointmentStatuses).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
