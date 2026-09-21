import { describe, it, expect } from 'vitest';
import {
  computeAvailableSlots,
  getWeekday,
  isSlotOffered,
  toMinutes,
  type DayAvailability,
} from '@/lib/appointments/slots';

// 2025-01-06 is a Monday. Fixed dates keep the tests deterministic.
const MONDAY = new Date(2025, 0, 6);
const TUESDAY = new Date(2025, 0, 7);

const availability: DayAvailability[] = [
  {
    day: 'Monday',
    slots: [
      { startTime: '10:00', endTime: '10:30' },
      { startTime: '11:00', endTime: '11:30' },
      { startTime: '14:00', endTime: '14:30' },
    ],
  },
];

describe('getWeekday', () => {
  it('names the weekday for a date', () => {
    expect(getWeekday(MONDAY)).toBe('Monday');
    expect(getWeekday(TUESDAY)).toBe('Tuesday');
  });
});

describe('toMinutes', () => {
  it('parses valid times', () => {
    expect(toMinutes('00:00')).toBe(0);
    expect(toMinutes('10:30')).toBe(630);
    expect(toMinutes('23:59')).toBe(1439);
  });
  it('returns NaN for invalid times', () => {
    expect(toMinutes('24:00')).toBeNaN();
    expect(toMinutes('9am')).toBeNaN();
  });
});

describe('computeAvailableSlots', () => {
  const earlyMonday = new Date(2025, 0, 6, 8, 0); // 08:00, before all slots

  it('returns all offered slots for a future day', () => {
    const slots = computeAvailableSlots(availability, MONDAY, [], new Date(2025, 0, 1));
    expect(slots.map((s) => s.startTime)).toEqual(['10:00', '11:00', '14:00']);
  });

  it('excludes already-booked slots', () => {
    const slots = computeAvailableSlots(availability, MONDAY, ['11:00'], new Date(2025, 0, 1));
    expect(slots.map((s) => s.startTime)).toEqual(['10:00', '14:00']);
  });

  it('returns nothing when the doctor does not work that weekday', () => {
    expect(computeAvailableSlots(availability, TUESDAY, [], new Date(2025, 0, 1))).toEqual([]);
  });

  it('excludes slots that already started today', () => {
    const noonMonday = new Date(2025, 0, 6, 12, 0);
    const slots = computeAvailableSlots(availability, MONDAY, [], noonMonday);
    expect(slots.map((s) => s.startTime)).toEqual(['14:00']);
  });

  it('keeps all future slots when booking early in the day', () => {
    const slots = computeAvailableSlots(availability, MONDAY, [], earlyMonday);
    expect(slots).toHaveLength(3);
  });

  it('returns nothing for a past date', () => {
    const slots = computeAvailableSlots(availability, MONDAY, [], new Date(2025, 0, 10));
    expect(slots).toEqual([]);
  });
});

describe('isSlotOffered', () => {
  it('accepts a slot the doctor offers that weekday', () => {
    expect(isSlotOffered(availability, MONDAY, { startTime: '10:00', endTime: '10:30' })).toBe(true);
  });
  it('rejects a slot not in availability', () => {
    expect(isSlotOffered(availability, MONDAY, { startTime: '09:00', endTime: '09:30' })).toBe(false);
  });
  it('rejects any slot on a non-working weekday', () => {
    expect(isSlotOffered(availability, TUESDAY, { startTime: '10:00', endTime: '10:30' })).toBe(false);
  });
});
