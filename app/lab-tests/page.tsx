'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FlaskConical, Clock, Loader2, CheckCircle2 } from 'lucide-react';

interface LabTest {
  _id: string;
  name: string;
  description?: string;
  price: number;
  mrp: number;
  category: string;
  sampleType: string;
  reportTimeHours: number;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function LabTestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [date, setDate] = useState(todayStr());
  const [busy, setBusy] = useState(false);
  const [booked, setBooked] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/lab-tests?${params.toString()}`);
      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.error || 'Failed to load tests.');
        setTests([]);
      } else {
        setTests(result.data);
      }
    } catch {
      setError('Failed to load tests. Please try again.');
      setTests([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const handleBook = async (test: LabTest) => {
    setMessage(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('authtoken') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/lab-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ testId: test._id, date }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setMessage(result.error || 'Could not book test.');
      } else {
        setBooked(test._id);
        setBookingId(null);
        setTimeout(() => setBooked(null), 2500);
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="bg-apollo-blue py-8">
        <div className="apollo-container">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-1">Lab Tests</h1>
          <p className="text-white/90 text-sm">
            Book diagnostic tests with free home sample collection
          </p>
        </div>
      </section>

      <div className="apollo-container py-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tests (e.g. Thyroid, CBC)…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md"
          />
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-apollo-blue" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        ) : tests.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <FlaskConical className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-600">No tests found.</p>
            <p className="text-gray-400 text-sm mt-1">Tip: run <code>npm run seed:lab-tests</code> to add sample tests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((test) => (
              <div key={test._id} className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{test.name}</h3>
                    {test.description && (
                      <p className="text-sm text-gray-500 mt-1">{test.description}</p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                      <span>Sample: {test.sampleType}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Report in {test.reportTimeHours}h
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-semibold text-apollo-blue">₹{test.price}</span>
                    {test.mrp > test.price && (
                      <div className="text-xs text-gray-400 line-through">₹{test.mrp}</div>
                    )}
                  </div>
                </div>

                {booked === test._id ? (
                  <p className="mt-3 flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle2 className="h-4 w-4" /> Booked for {date}
                  </p>
                ) : bookingId === test._id ? (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="date"
                      value={date}
                      min={todayStr()}
                      onChange={(e) => setDate(e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                    />
                    <button
                      onClick={() => handleBook(test)}
                      disabled={busy}
                      className="bg-apollo-blue text-white text-sm px-3 py-1.5 rounded-md hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {busy ? 'Booking…' : 'Confirm'}
                    </button>
                    <button
                      onClick={() => setBookingId(null)}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setBookingId(test._id);
                      setMessage(null);
                    }}
                    className="mt-3 border border-apollo-blue text-apollo-blue text-sm px-4 py-1.5 rounded-md hover:bg-blue-50"
                  >
                    Book test
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {message && <p className="text-red-600 text-sm mt-4">{message}</p>}
      </div>
    </main>
  );
}
