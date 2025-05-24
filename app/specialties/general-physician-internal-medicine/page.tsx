import { Metadata } from 'next';
import DoctorListing from '@/components/doctors/DoctorListing';

export const metadata: Metadata = {
  title: 'General Physician & Internal Medicine Specialists | Apollo 247',
  description: 'Book appointment with best general physicians and internal medicine specialists at Apollo 247. Consult online or visit for in-person appointments.',
  keywords: 'general physician, internal medicine, doctor appointment, apollo 247, medical consultation',
};

export default function GeneralPhysicianPage() {
  return (
    <main>
      <section className="bg-apollo-blue py-8 md:py-12">
        <div className="apollo-container">
          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            General Physician & Internal Medicine
          </h1>
          <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-3xl">
            Consult with qualified and experienced General Physicians and Internal Medicine specialists at Apollo 247. Book your appointment today.
          </p>
        </div>
      </section>

      <DoctorListing specialty="General Physician" />
    </main>
  );
}