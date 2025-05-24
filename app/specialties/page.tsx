'use client';

import Link from 'next/link';
import { Stethoscope, Heart, Brain, Eye, Bone, Bluetooth as Tooth, Baby } from 'lucide-react';

interface Specialty {
  name: string;
  slug: string;
  icon: React.ReactNode;
  description: string;
}

const specialties: Specialty[] = [
  {
    name: 'General Physician & Internal Medicine',
    slug: 'general-physician-internal-medicine',
    icon: <Stethoscope className="w-8 h-8 text-apollo-blue" />,
    description: 'Consult with qualified general physicians for common health issues and preventive care.'
  },
  {
    name: 'Cardiology',
    slug: 'cardiology',
    icon: <Heart className="w-8 h-8 text-apollo-blue" />,
    description: 'Expert care for heart conditions and cardiovascular health.'
  },
  {
    name: 'Neurology',
    slug: 'neurology',
    icon: <Brain className="w-8 h-8 text-apollo-blue" />,
    description: 'Specialized treatment for neurological disorders and conditions.'
  },
  {
    name: 'Ophthalmology',
    slug: 'ophthalmology',
    icon: <Eye className="w-8 h-8 text-apollo-blue" />,
    description: 'Complete eye care and vision correction services.'
  },
  {
    name: 'Orthopedics',
    slug: 'orthopedics',
    icon: <Bone className="w-8 h-8 text-apollo-blue" />,
    description: 'Treatment for bone, joint, and muscle conditions.'
  },
  {
    name: 'Dentistry',
    slug: 'dentistry',
    icon: <Tooth className="w-8 h-8 text-apollo-blue" />,
    description: 'Comprehensive dental care and oral health services.'
  },
  {
    name: 'Pediatrics',
    slug: 'pediatrics',
    icon: <Baby className="w-8 h-8 text-apollo-blue" />,
    description: 'Specialized healthcare for infants, children, and adolescents.'
  }
];

export default function SpecialtiesPage() {
  return (
    <main>
      <section className="bg-apollo-blue py-8 md:py-12">
        <div className="apollo-container">
          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Medical Specialties
          </h1>
          <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-3xl">
            Find and consult with specialist doctors across various medical fields
          </p>
        </div>
      </section>

      <section className="apollo-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty) => (
            <Link
              key={specialty.slug}
              href={`/specialties/${specialty.slug}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start gap-4">
                {specialty.icon}
                <div>
                  <h2 className="text-lg font-semibold text-apollo-blue mb-2">
                    {specialty.name}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {specialty.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}