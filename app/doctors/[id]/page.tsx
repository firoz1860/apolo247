'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  MapPin,
  Star,
  Video,
  Home,
  Building2,
  Calendar,
  Loader2,
} from 'lucide-react';

type ConsultationType = 'online' | 'in-person' | 'home';

interface Clinic {
  name: string;
  address: string;
  city: string;
  state: string;
  consultationFee: number;
}

interface Doctor {
  _id: string;
  name: string;
  primarySpecialization: string;
  specializations: string[];
  qualifications: string[];
  experience: number;
  gender: string;
  languages: string[];
  about?: string;
  profileImage?: string;
  rating: number;
  reviewsCount: number;
  isConsultOnline: boolean;
  isHomeVisit: boolean;
  clinics: Clinic[];
}

interface Slot {
  startTime: string;
  endTime: string;
}

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function DoctorDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const doctorId = params?.id;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);

  // Booking state
  const [consultationType, setConsultationType] = useState<ConsultationType>('online');
  const [clinicName, setClinicName] = useState('');
  const [date, setDate] = useState(todayStr());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    if (!doctorId) return;
    (async () => {
      try {
        const res = await fetch(`/api/doctors/${doctorId}`);
        const result = await res.json();
        if (!res.ok || !result.success) {
          setLoadError(result.error || 'Failed to load doctor');
        } else {
          setDoctor(result.data);
          if (!result.data.isConsultOnline) setConsultationType('in-person');
          if (result.data.clinics?.[0]) setClinicName(result.data.clinics[0].name);
        }
      } catch {
        setLoadError('Failed to load doctor. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [doctorId]);

  const loadReviews = useCallback(async () => {
    if (!doctorId) return;
    try {
      const res = await fetch(`/api/doctors/${doctorId}/reviews`);
      const result = await res.json();
      if (res.ok && result.success) setReviews(result.data);
    } catch {
      /* non-critical */
    }
  }, [doctorId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewMsg(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('authtoken') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    if (myRating < 1) {
      setReviewMsg('Please choose a star rating.');
      return;
    }
    setReviewSubmitting(true);
    try {
      const res = await fetch(`/api/doctors/${doctorId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: myRating, comment: myComment || undefined }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setReviewMsg(result.error || 'Could not submit review.');
      } else {
        setReviewMsg('Thanks for your review!');
        setMyComment('');
        setMyRating(0);
        loadReviews();
      }
    } catch {
      setReviewMsg('Something went wrong. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const loadSlots = useCallback(async () => {
    if (!doctorId || !date) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    try {
      const res = await fetch(`/api/doctors/${doctorId}/slots?date=${date}`);
      const result = await res.json();
      setSlots(res.ok && result.success ? result.data : []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [doctorId, date]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const handleBook = async () => {
    setMessage(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('authtoken') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    if (!selectedSlot) {
      setMessage({ type: 'error', text: 'Please select a time slot.' });
      return;
    }

    setBooking(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId,
          date,
          slot: selectedSlot,
          consultationType,
          ...(consultationType === 'online' ? {} : { clinicName }),
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setMessage({ type: 'error', text: result.error || 'Booking failed.' });
        if (res.status === 409) loadSlots();
      } else {
        setMessage({ type: 'success', text: 'Appointment booked! Redirecting…' });
        setTimeout(() => router.push('/appointments'), 1200);
      }
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="apollo-container py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-apollo-blue" />
      </div>
    );
  }

  if (loadError || !doctor) {
    return (
      <div className="apollo-container py-16 text-center">
        <p className="text-red-600 mb-4">{loadError || 'Doctor not found.'}</p>
        <Link href="/find-doctors" className="text-apollo-blue font-medium hover:underline">
          Back to doctors
        </Link>
      </div>
    );
  }

  const selectedClinic = doctor.clinics.find((c) => c.name === clinicName);
  const displayFee =
    consultationType === 'online'
      ? Math.min(...doctor.clinics.map((c) => c.consultationFee), Infinity)
      : selectedClinic?.consultationFee;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="apollo-container py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor profile */}
        <section className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-apollo-blue flex-shrink-0">
              <Image
                src={
                  doctor.profileImage ||
                  'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=150'
                }
                alt={doctor.name}
                width={150}
                height={150}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-apollo-blue">{doctor.name}</h1>
              <p className="text-gray-600">{doctor.primarySpecialization}</p>
              <p className="text-sm text-gray-700 mt-1">{doctor.qualifications.join(', ')}</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="flex items-center text-green-700 bg-green-50 px-2 py-1 rounded">
                  <Star className="h-4 w-4 fill-green-500 text-green-500 mr-1" />
                  {doctor.rating.toFixed(1)} ({doctor.reviewsCount})
                </span>
                <span className="flex items-center text-gray-600">
                  <Award className="h-4 w-4 mr-1 text-apollo-blue" />
                  {doctor.experience} yrs exp
                </span>
              </div>
            </div>
          </div>

          {doctor.about && (
            <div className="mt-6">
              <h2 className="font-semibold text-gray-800 mb-1">About</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{doctor.about}</p>
            </div>
          )}

          <div className="mt-6">
            <h2 className="font-semibold text-gray-800 mb-2">Clinics</h2>
            <div className="space-y-2">
              {doctor.clinics.map((clinic, idx) => (
                <div key={idx} className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-700">{clinic.name}</span>
                    <span className="text-gray-500 ml-1">
                      — {clinic.address}, {clinic.city} · ₹{clinic.consultationFee}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-6 border-t pt-6">
            <h2 className="font-semibold text-gray-800 mb-3">
              Patient reviews ({reviews.length})
            </h2>

            <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-md p-4 mb-4">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setMyRating(n)}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        n <= myRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={myComment}
                onChange={(e) => setMyComment(e.target.value)}
                placeholder="Share your experience (optional)"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                rows={2}
              />
              {reviewMsg && <p className="text-sm mt-1 text-apollo-blue">{reviewMsg}</p>}
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="mt-2 bg-apollo-blue text-white text-sm px-4 py-1.5 rounded-md hover:bg-opacity-90 disabled:opacity-50"
              >
                {reviewSubmitting ? 'Submitting…' : 'Submit review'}
              </button>
            </form>

            {reviews.length === 0 ? (
              <p className="text-sm text-gray-500">No reviews yet. Be the first to review.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r._id} className="border-b pb-3 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 text-sm">{r.userName}</span>
                      <span className="flex items-center">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </span>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Booking panel */}
        <aside className="bg-white rounded-lg shadow-sm p-6 h-fit lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-apollo-blue" />
            Book an appointment
          </h2>

          {/* Consultation type */}
          <div className="flex flex-wrap gap-2 mb-4">
            {doctor.isConsultOnline && (
              <TypeButton
                active={consultationType === 'online'}
                onClick={() => setConsultationType('online')}
                icon={<Video className="h-4 w-4" />}
                label="Online"
              />
            )}
            <TypeButton
              active={consultationType === 'in-person'}
              onClick={() => setConsultationType('in-person')}
              icon={<Building2 className="h-4 w-4" />}
              label="In-clinic"
            />
            {doctor.isHomeVisit && (
              <TypeButton
                active={consultationType === 'home'}
                onClick={() => setConsultationType('home')}
                icon={<Home className="h-4 w-4" />}
                label="Home"
              />
            )}
          </div>

          {/* Clinic selection for non-online */}
          {consultationType !== 'online' && (
            <label className="block mb-4 text-sm">
              <span className="text-gray-700 font-medium">Clinic</span>
              <select
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {doctor.clinics.map((clinic) => (
                  <option key={clinic.name} value={clinic.name}>
                    {clinic.name} — {clinic.city} (₹{clinic.consultationFee})
                  </option>
                ))}
              </select>
            </label>
          )}

          {/* Date */}
          <label className="block mb-4 text-sm">
            <span className="text-gray-700 font-medium">Date</span>
            <input
              type="date"
              value={date}
              min={todayStr()}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </label>

          {/* Slots */}
          <div className="mb-4">
            <span className="text-gray-700 font-medium text-sm">Available slots</span>
            {slotsLoading ? (
              <div className="py-4 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-apollo-blue" />
              </div>
            ) : slots.length === 0 ? (
              <p className="text-sm text-gray-500 mt-2">No slots available for this day.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {slots.map((slot) => (
                  <button
                    key={slot.startTime}
                    onClick={() => setSelectedSlot(slot)}
                    className={`text-xs py-2 rounded border transition-colors ${
                      selectedSlot?.startTime === slot.startTime
                        ? 'bg-apollo-blue text-white border-apollo-blue'
                        : 'border-gray-300 text-gray-700 hover:border-apollo-blue'
                    }`}
                  >
                    {slot.startTime}
                  </button>
                ))}
              </div>
            )}
          </div>

          {displayFee !== undefined && Number.isFinite(displayFee) && (
            <p className="text-sm text-gray-600 mb-3">
              Fee: <span className="font-semibold text-apollo-blue">₹{displayFee}</span>
            </p>
          )}

          {message && (
            <p
              className={`text-sm mb-3 ${
                message.type === 'error' ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            onClick={handleBook}
            disabled={booking || !selectedSlot}
            className="w-full flex justify-center items-center bg-apollo-blue text-white py-2.5 rounded-md font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {booking ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm booking'}
          </button>
        </aside>
      </div>
    </main>
  );
}

function TypeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? 'bg-apollo-blue text-white border-apollo-blue'
          : 'border-gray-300 text-gray-700 hover:border-apollo-blue'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
