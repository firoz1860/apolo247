'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DoctorCard from './DoctorCard';
import FilterSidebar from './FilterSidebar';
import Pagination from './Pagination';
import SortOptions from './SortOptions';
import { Filter, Star, Stethoscope, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IDoctor } from '@/lib/db/models/Doctor';

interface DoctorListingProps {
  specialty?: string;
}

export default function DoctorListing({ specialty = 'General Physician' }: DoctorListingProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State for mobile filter drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // States for doctors data and loading
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Generate query string from search params
  const generateQueryString = () => {
    const params = new URLSearchParams(searchParams);
    if (specialty) {
      params.set('specialization', specialty);
    }
    return params.toString();
  };

  // Fetch doctors with current filters
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const queryString = generateQueryString();
      const response = await fetch(`/api/doctors?${queryString}`);
      console.log('API Response:', response);
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      
      const result = await response.json();
      console.log('Fetched Doctors:', result);
      
      if (result.success) {
        setDoctors(result.data || []);
        setPagination(result.pagination);
      } else {
        setError(result.error || 'Failed to load doctors');
        setDoctors([]);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again later.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch doctors when filters change
  useEffect(() => {
    fetchDoctors();
  }, [searchParams]);

  // Sample mock data for initial render (this would normally come from the API)
  useEffect(() => {
    // This is just for demonstration purposes until backend is connected
    const mockDoctors = [
      {
        _id: '1',
        name: 'Dr. Samantha Wilson',
        specializations: ['General Physician', 'Internal Medicine'],
        primarySpecialization: 'General Physician',
        qualifications: ['MBBS', 'MD (General Medicine)'],
        experience: 15,
        gender: 'female',
        languages: ['English', 'Hindi'],
        clinics: [
          {
            name: 'Apollo Clinic',
            address: '123 Main Street',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            consultationFee: 800
          }
        ],
        availability: [
          {
            day: 'Monday',
            slots: [
              {
                startTime: '09:00',
                endTime: '13:00'
              }
            ]
          }
        ],
        about: 'Dr. Wilson is a senior consultant with over 15 years of experience in treating general medical conditions.',
        profileImage: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4.8,
        reviewsCount: 235,
        isConsultOnline: true,
        isHomeVisit: false
      },
      {
        _id: '2',
        name: 'Dr. Rajesh Kumar',
        specializations: ['General Physician', 'Diabetology'],
        primarySpecialization: 'General Physician',
        qualifications: ['MBBS', 'DNB (General Medicine)'],
        experience: 10,
        gender: 'male',
        languages: ['English', 'Hindi', 'Tamil'],
        clinics: [
          {
            name: 'Apollo Hospital',
            address: '456 Garden Road',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110002',
            consultationFee: 700
          }
        ],
        availability: [
          {
            day: 'Tuesday',
            slots: [
              {
                startTime: '10:00',
                endTime: '18:00'
              }
            ]
          }
        ],
        about: 'Dr. Kumar specializes in diabetes management and general medicine with 10 years of experience.',
        profileImage: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4.6,
        reviewsCount: 189,
        isConsultOnline: true,
        isHomeVisit: true
      },
      {
        _id: '3',
        name: 'Dr. Sarah Ahmed',
        specializations: ['General Physician', 'Family Medicine'],
        primarySpecialization: 'General Physician',
        qualifications: ['MBBS', 'MD (Family Medicine)'],
        experience: 8,
        gender: 'female',
        languages: ['English', 'Hindi', 'Urdu'],
        clinics: [
          {
            name: 'Apollo Spectra',
            address: '789 River View',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110003',
            consultationFee: 900
          }
        ],
        availability: [
          {
            day: 'Wednesday',
            slots: [
              {
                startTime: '09:00',
                endTime: '14:00'
              }
            ]
          }
        ],
        about: 'Dr. Ahmed focuses on family medicine and preventive care with a patient-centered approach.',
        profileImage: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4.7,
        reviewsCount: 156,
        isConsultOnline: false,
        isHomeVisit: false
      },
      {
        _id: '4',
        name: 'Dr. Vikram Singh',
        specializations: ['General Physician', 'Respiratory Medicine'],
        primarySpecialization: 'General Physician',
        qualifications: ['MBBS', 'MD (Respiratory Medicine)'],
        experience: 12,
        gender: 'male',
        languages: ['English', 'Hindi', 'Punjabi'],
        clinics: [
          {
            name: 'Apollo Clinic',
            address: '321 Hill Road',
            city: 'Gurgaon',
            state: 'Haryana',
            pincode: '122001',
            consultationFee: 1000
          }
        ],
        availability: [
          {
            day: 'Thursday',
            slots: [
              {
                startTime: '11:00',
                endTime: '19:00'
              }
            ]
          }
        ],
        about: 'Dr. Singh is an expert in respiratory conditions and general medicine with 12 years of practice.',
        profileImage: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150',
        rating: 4.9,
        reviewsCount: 210,
        isConsultOnline: true,
        isHomeVisit: false
      }
    ] as unknown as IDoctor[];
    
    setDoctors(mockDoctors);
    setPagination({
      ...pagination,
      total: mockDoctors.length,
      totalPages: 1,
    });
    setLoading(false);
  }, []);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="apollo-container py-6">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button 
            className="w-full flex items-center justify-center bg-white p-3 rounded-md shadow-sm text-apollo-blue font-medium"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <Filter size={18} className="mr-2" />
            Filter Doctors
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden md:block w-full md:w-1/4 lg:w-1/5">
            <FilterSidebar />
          </div>

          {/* Filter Sidebar - Mobile */}
          <div 
            className={cn(
              "fixed inset-0 bg-white z-50 md:hidden transform transition-transform duration-300 ease-in-out overflow-auto",
              isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-apollo-blue">Filters</h2>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <FilterSidebar onApply={() => setIsMobileFilterOpen(false)} />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            {/* Header with Count and Sort */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center">
                  <Stethoscope className="text-apollo-blue mr-2" size={20} />
                  <h2 className="text-lg font-semibold">
                    {specialty} Specialists 
                    <span className="text-gray-500 text-sm ml-2">
                      ({doctors.length} doctors)
                    </span>
                  </h2>
                </div>
                <SortOptions />
              </div>
            </div>
            
            {/* Doctor Cards */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-gray-200 h-16 w-16"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="flex gap-2">
                          <div className="h-8 bg-gray-200 rounded w-24"></div>
                          <div className="h-8 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-600">
                {error}
              </div>
            ) : doctors.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="mb-4">
                  <Stethoscope className="mx-auto text-gray-400" size={48} />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No doctors found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters to find more doctors.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor._id.toString()} doctor={doctor} />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!loading && !error && doctors.length > 0 && (
              <div className="mt-6">
                <Pagination 
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages} 
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}