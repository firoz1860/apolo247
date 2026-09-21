'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Video, Home, Building2, Loader2 } from 'lucide-react';

type Status = 'booked' | 'cancelled' | 'completed';

interface Appointment {
  _id: string;
  doctor: string;
  doctorName: string;
  clinicName?: string;
  consultationType: 'online' | 'in-person' | 'home';
  date: string;
  slot: { startTime: string; endTime: string };
  fee: number;
  status: Status;
}

const statusStyles: Record<Status, string> = {
  booked: 'bg-blue-50 text-apollo-blue',
  cancelled: 'bg-red-50 text-red-600',
  completed: 'bg-green-50 text-green-700',
};

const typeIcon = {
  online: <Video className="h-4 w-4" />,
  'in-person': <Building2 className="h-4 w-4" />,
  home: <Home className="h-4 w-4" />,
};

const FILTERS: { label: string; value: Status | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Booked', value: 'booked' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [cancelling, setCancelling] = useState<string | null>(null);

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('authtoken') : null;

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setNeedsLogin(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const query = filter === 'all' ? '' : `?status=${filter}`;
      const res = await fetch(`/api/appointments${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setNeedsLogin(true);
        return;
      }
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.error || 'Failed to load appointments.');
      } else {
        setAppointments(result.data);
      }
    } catch {
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async (id: string) => {
    const token = getToken();
    if (!token) return;
    setCancelling(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'cancel' }),
      });
      if (res.ok) load();
    } finally {
      setCancelling(null);
    }
  };

  if (needsLogin) {
    return (
      <div className="apollo-container py-16 text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Please sign in</h1>
        <p className="text-gray-600 mb-4">You need to be logged in to view your appointments.</p>
        <Link
          href="/login"
          className="inline-block bg-apollo-blue text-white px-5 py-2 rounded-md font-medium hover:bg-opacity-90"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="apollo-container py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-apollo-blue" />
          My Appointments
        </h1>

        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                filter === f.value
                  ? 'bg-apollo-blue text-white border-apollo-blue'
                  : 'border-gray-300 text-gray-700 hover:border-apollo-blue'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-apollo-blue" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h2 className="text-lg font-semibold text-gray-700 mb-1">No appointments yet</h2>
            <p className="text-gray-500 mb-4">Book a consultation with a doctor to get started.</p>
            <Link
              href="/find-doctors"
              className="inline-block bg-apollo-blue text-white px-5 py-2 rounded-md font-medium hover:bg-opacity-90"
            >
              Find doctors
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white rounded-lg shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/doctors/${appt.doctor}`}
                      className="font-semibold text-apollo-blue hover:underline"
                    >
                      {appt.doctorName}
                    </Link>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusStyles[appt.status]}`}
                    >
                      {appt.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> {appt.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {appt.slot.startTime}–{appt.slot.endTime}
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                      {typeIcon[appt.consultationType]} {appt.consultationType}
                    </span>
                    {appt.clinicName && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {appt.clinicName}
                      </span>
                    )}
                    <span className="font-medium text-apollo-blue">₹{appt.fee}</span>
                  </div>
                </div>

                {appt.status === 'booked' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/doctors/${appt.doctor}`}
                      className="text-sm px-3 py-1.5 rounded border border-apollo-blue text-apollo-blue hover:bg-blue-50"
                    >
                      Reschedule
                    </Link>
                    <button
                      onClick={() => handleCancel(appt._id)}
                      disabled={cancelling === appt._id}
                      className="text-sm px-3 py-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {cancelling === appt._id ? 'Cancelling…' : 'Cancel'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
