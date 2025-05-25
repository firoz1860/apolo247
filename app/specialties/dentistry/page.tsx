'use client';

import DoctorListing from '@/components/doctors/DoctorListing';

export default function DentistryPage() {
  return (
    <main>
      <section className="bg-apollo-blue py-8 md:py-12">
        <div className="apollo-container">
          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Dentistry
          </h1>
          <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-3xl">
            Consult with qualified and experienced Dentists at Apollo 247. Book your appointment today.
          </p>
        </div>
      </section>

      <DoctorListing specialty="Dentistry" />
    </main>
  );
}