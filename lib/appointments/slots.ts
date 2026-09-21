/**
 * Pure appointment-slot logic. No database or framework dependencies so it can
 * be unit-tested in isolation.
 */

export interface TimeSlot {
  startTime: string; // "HH:MM" 24h
  endTime: string; // "HH:MM" 24h
}

export interface DayAvailability {
  day: string; // e.g. "Monday"
  slots: TimeSlot[];
}

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/** Return the weekday name ("Monday", ...) for a date. */
export function getWeekday(date: Date): string {
  return WEEKDAYS[date.getDay()];
}

/** True when two dates fall on the same calendar day (local time). */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Convert "HH:MM" to minutes since midnight. Returns NaN for bad input. */
export function toMinutes(time: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return NaN;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return NaN;
  return hours * 60 + minutes;
}

/**
 * Compute the bookable slots for a doctor on a given date.
 *
 * A slot is bookable when it belongs to the doctor's availability for that
 * weekday, is not already booked, and (for the current day) has not already
 * started. Dates in the past yield no slots.
 *
 * @param availability   the doctor's weekly availability
 * @param date           the date the patient wants to book
 * @param bookedStartTimes start times already taken for that date
 * @param now            current time (injectable for testing)
 */
export function computeAvailableSlots(
  availability: DayAvailability[],
  date: Date,
  bookedStartTimes: string[] = [],
  now: Date = new Date()
): TimeSlot[] {
  // No booking in the past (compare calendar days).
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (startOfDay.getTime() < startOfToday.getTime()) {
    return [];
  }

  const weekday = getWeekday(date);
  const dayAvailability = availability.find(
    (a) => a.day.toLowerCase() === weekday.toLowerCase()
  );
  if (!dayAvailability) {
    return [];
  }

  const booked = new Set(bookedStartTimes);
  const bookingToday = isSameDay(date, now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return dayAvailability.slots.filter((slot) => {
    if (booked.has(slot.startTime)) return false;
    if (bookingToday && toMinutes(slot.startTime) <= nowMinutes) return false;
    return true;
  });
}

/** True when `slot` exists in the doctor's availability for `date`'s weekday. */
export function isSlotOffered(
  availability: DayAvailability[],
  date: Date,
  slot: TimeSlot
): boolean {
  const weekday = getWeekday(date);
  const dayAvailability = availability.find(
    (a) => a.day.toLowerCase() === weekday.toLowerCase()
  );
  if (!dayAvailability) return false;
  return dayAvailability.slots.some(
    (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
  );
}
