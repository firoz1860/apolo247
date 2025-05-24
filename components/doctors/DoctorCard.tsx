'use client';

import Image from 'next/image';
import { Star, Calendar, Video, Clock, MapPin, Award, Home } from 'lucide-react';
import { IDoctor } from '@/lib/db/models/Doctor';

interface DoctorCardProps {
  doctor: IDoctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const lowestFee = doctor.clinics.reduce(
    (min, clinic) => Math.min(min, clinic.consultationFee),
    doctor.clinics[0]?.consultationFee || 0
  );

  const experienceText = `${doctor.experience} year${doctor.experience > 1 ? 's' : ''} experience`;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Profile section */}
        <div className="md:w-1/4 flex flex-col items-center">
          <div className="relative w-24 h-24 md:w-28 md:h-28 overflow-hidden rounded-full border-2 border-apollo-blue mb-3">
            <Image
              src={doctor.profileImage || "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=150"}
              alt={doctor.name}
              width={150}
              height={150}
              className="object-cover"
            />
          </div>

          <div className="flex items-center justify-center mb-2">
            <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded text-sm font-medium">
              <Star className="h-4 w-4 fill-green-500 text-green-500 mr-1" />
              <span>{doctor.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-500 ml-2">
              ({doctor.reviewsCount} reviews)
            </span>
          </div>

          <div className="text-gray-500 text-sm flex items-center">
            <Award className="h-4 w-4 mr-1 text-apollo-blue" />
            <span>{experienceText}</span>
          </div>
        </div>

        {/* Doctor info */}
        <div className="md:w-2/4 flex-1">
          <h3 className="text-xl font-semibold text-apollo-blue">{doctor.name}</h3>
          <p className="text-gray-600 mb-2">
            {doctor.primarySpecialization}
            {doctor.specializations.length > 1 && ` & ${doctor.specializations.length - 1} more`}
          </p>
          <p className="text-sm text-gray-700 mb-3">
            {doctor.qualifications.join(', ')}
          </p>

          <div className="space-y-2">
            {doctor.clinics.map((clinic, idx) => (
              <div key={idx} className="flex items-start text-sm">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-700">{clinic.name}</span>
                  <span className="text-gray-500 ml-1">
                    - {clinic.address}, {clinic.city}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {doctor.availability?.length > 0 && (
            <div className="flex items-center mt-3 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span>
                Available: {doctor.availability[0].day} ({doctor.availability[0].slots[0].startTime} - {doctor.availability[0].slots[0].endTime})
              </span>
            </div>
          )}
        </div>

        {/* Booking section */}
        <div className="md:w-1/4 flex flex-col justify-center mt-4 md:mt-0 border-t pt-4 md:pt-0 md:border-t-0 md:border-l md:pl-6">
          <div className="mb-4">
            <p className="text-gray-500 text-sm mb-1">Consultation Fee</p>
            <p className="text-xl font-semibold text-apollo-blue">₹{lowestFee}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {doctor.isConsultOnline && (
              <div className="flex items-center text-xs text-apollo-blue bg-blue-50 px-2 py-1 rounded-full">
                <Video className="h-3 w-3 mr-1" />
                Online
              </div>
            )}
            <div className="flex items-center text-xs text-apollo-green bg-green-50 px-2 py-1 rounded-full">
              <Calendar className="h-3 w-3 mr-1" />
              In-clinic
            </div>
            {doctor.isHomeVisit && (
              <div className="flex items-center text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                <Home className="h-3 w-3 mr-1" />
                Home Visit
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <button className="bg-apollo-blue text-white py-2 px-4 rounded text-sm font-medium hover:bg-opacity-90 transition-colors">
              Book Appointment
            </button>
            {doctor.isConsultOnline && (
              <button className="border border-apollo-blue text-apollo-blue py-2 px-4 rounded text-sm font-medium hover:bg-blue-50 transition-colors">
                Consult Online
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
