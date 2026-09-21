'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, User, Mail, Phone, Loader2, HeartPulse } from 'lucide-react';

interface MedicalHistory {
  conditions?: string[];
  allergies?: string[];
  medications?: string[];
}

interface Profile {
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  medicalHistory?: MedicalHistory;
}

export default function HealthRecordsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authtoken') : null;
    if (!token) {
      setNeedsLogin(true);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          setNeedsLogin(true);
          return;
        }
        const result = await res.json();
        if (!res.ok || !result.success) {
          setError(result.error || 'Failed to load your records.');
        } else {
          setProfile(result.data);
        }
      } catch {
        setError('Failed to load your records. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="apollo-container py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-apollo-blue" />
      </div>
    );
  }

  if (needsLogin) {
    return (
      <div className="apollo-container py-16 text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Please sign in</h1>
        <p className="text-gray-600 mb-4">Log in to view your health records.</p>
        <Link
          href="/login"
          className="inline-block bg-apollo-blue text-white px-5 py-2 rounded-md font-medium hover:bg-opacity-90"
        >
          Go to login
        </Link>
      </div>
    );
  }

  const history = profile?.medicalHistory;
  const hasHistory =
    history &&
    ((history.conditions?.length ?? 0) > 0 ||
      (history.allergies?.length ?? 0) > 0 ||
      (history.medications?.length ?? 0) > 0);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="apollo-container py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FileText className="h-6 w-6 mr-2 text-apollo-blue" />
          Health Records
        </h1>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}

        {profile && (
          <>
            <section className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <h2 className="font-semibold text-gray-800 mb-3">Profile</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" /> {profile.name}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" /> {profile.email}
                </p>
                {profile.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" /> {profile.phone}
                  </p>
                )}
                {profile.gender && (
                  <p className="capitalize text-gray-600">Gender: {profile.gender}</p>
                )}
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center">
                <HeartPulse className="h-5 w-5 mr-2 text-apollo-blue" />
                Medical History
              </h2>
              {hasHistory ? (
                <div className="space-y-3 text-sm">
                  <RecordList label="Conditions" values={history?.conditions} />
                  <RecordList label="Allergies" values={history?.allergies} />
                  <RecordList label="Medications" values={history?.medications} />
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No medical history on file yet. Your conditions, allergies and medications will
                  appear here once added to your profile.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function RecordList({ label, values }: { label: string; values?: string[] }) {
  if (!values || values.length === 0) return null;
  return (
    <div>
      <p className="text-gray-500 font-medium">{label}</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {values.map((v) => (
          <span key={v} className="bg-blue-50 text-apollo-blue px-2 py-1 rounded text-xs">
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}
