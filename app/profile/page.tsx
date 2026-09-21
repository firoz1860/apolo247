'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Loader2, Save } from 'lucide-react';

interface FormState {
  name: string;
  phone: string;
  gender: '' | 'male' | 'female' | 'other';
  conditions: string;
  allergies: string;
  medications: string;
}

const empty: FormState = {
  name: '',
  phone: '',
  gender: '',
  conditions: '',
  allergies: '',
  medications: '',
};

const toList = (s: string) =>
  s.split(',').map((x) => x.trim()).filter(Boolean);

export default function ProfilePage() {
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('authtoken') : null;

  useEffect(() => {
    const token = getToken();
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
        if (res.ok && result.success) {
          const u = result.data;
          setForm({
            name: u.name || '',
            phone: u.phone || '',
            gender: u.gender || '',
            conditions: (u.medicalHistory?.conditions || []).join(', '),
            allergies: (u.medicalHistory?.allergies || []).join(', '),
            medications: (u.medicalHistory?.medications || []).join(', '),
          });
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to load profile.' });
        }
      } catch {
        setMessage({ type: 'error', text: 'Failed to load profile.' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const token = getToken();
    if (!token) {
      setNeedsLogin(true);
      return;
    }
    setSaving(true);

    const payload: Record<string, unknown> = {
      name: form.name,
      medicalHistory: {
        conditions: toList(form.conditions),
        allergies: toList(form.allergies),
        medications: toList(form.medications),
      },
    };
    if (form.phone) payload.phone = form.phone;
    if (form.gender) payload.gender = form.gender;

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setMessage({ type: 'error', text: result.error || 'Could not save profile.' });
      } else {
        setMessage({ type: 'success', text: 'Profile saved.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

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
        <p className="text-gray-600 mb-4">Log in to view and edit your profile.</p>
        <Link
          href="/login"
          className="inline-block bg-apollo-blue text-white px-5 py-2 rounded-md font-medium hover:bg-opacity-90"
        >
          Go to login
        </Link>
      </div>
    );
  }

  const field = 'mt-1 block w-full border border-gray-300 rounded-md px-3 py-2';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="apollo-container py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <User className="h-6 w-6 mr-2 text-apollo-blue" />
          My Profile
        </h1>

        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm p-6 space-y-5">
          <label className="block text-sm">
            <span className="text-gray-700 font-medium">Full name</span>
            <input
              className={field}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block text-sm">
              <span className="text-gray-700 font-medium">Phone (10 digits)</span>
              <input
                className={field}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="9876543210"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-700 font-medium">Gender</span>
              <select
                className={field}
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as FormState['gender'] })}
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <fieldset className="border-t pt-4">
            <legend className="text-sm font-semibold text-gray-700 mb-2">
              Medical history (comma-separated)
            </legend>
            <label className="block text-sm mb-3">
              <span className="text-gray-600">Conditions</span>
              <input
                className={field}
                value={form.conditions}
                onChange={(e) => setForm({ ...form, conditions: e.target.value })}
                placeholder="e.g. Diabetes, Hypertension"
              />
            </label>
            <label className="block text-sm mb-3">
              <span className="text-gray-600">Allergies</span>
              <input
                className={field}
                value={form.allergies}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                placeholder="e.g. Penicillin"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">Medications</span>
              <input
                className={field}
                value={form.medications}
                onChange={(e) => setForm({ ...form, medications: e.target.value })}
                placeholder="e.g. Metformin"
              />
            </label>
          </fieldset>

          {message && (
            <p className={`text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full flex justify-center items-center gap-2 bg-apollo-blue text-white py-2.5 rounded-md font-medium hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-4 w-4" /> Save changes</>}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/health-records" className="text-sm text-apollo-blue hover:underline">
            View health records →
          </Link>
        </div>
      </div>
    </main>
  );
}
