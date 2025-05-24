'use client';

import { useState, useEffect } from 'react';
import DoctorListing from '@/components/doctors/DoctorListing';

export default function FindDoctorsPage() {
  return (
    <main>
      <section className="bg-apollo-blue py-8 md:py-12">
        <div className="apollo-container">
          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Find Doctors
          </h1>
          <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-3xl">
            Book appointments with the best doctors and specialists in your area
          </p>
        </div>
      </section>

      <DoctorListing />
    </main>
  );
}