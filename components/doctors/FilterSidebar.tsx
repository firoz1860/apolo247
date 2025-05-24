'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  CheckSquare, 
  Square, 
  Award, 
  Star, 
  User, 
  Calendar, 
  Video, 
  Home, 
  Filter,
  ChevronDown,
  ChevronUp 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  onApply?: () => void;
}

export default function FilterSidebar({ onApply }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for UI collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    experience: true,
    gender: true,
    fee: true,
    availability: true,
    rating: true,
  });
  
  // State for filters
  const [filters, setFilters] = useState({
    gender: searchParams.get('gender') || '',
    minExperience: searchParams.get('minExperience') || '',
    maxFee: searchParams.get('maxFee') || '',
    isOnline: searchParams.get('isOnline') === 'true',
    isHomeVisit: searchParams.get('isHomeVisit') === 'true',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || 'rating',
  });
  
  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    // Create new URLSearchParams object
    const params = new URLSearchParams();
    
    // Add all filter parameters that have values
    if (filters.gender) params.set('gender', filters.gender);
    if (filters.minExperience) params.set('minExperience', filters.minExperience);
    if (filters.maxFee) params.set('maxFee', filters.maxFee);
    if (filters.minRating) params.set('minRating', filters.minRating);
    if (filters.isOnline) params.set('isOnline', 'true');
    if (filters.isHomeVisit) params.set('isHomeVisit', 'true');
    if (filters.sort) params.set('sort', filters.sort);
    
    // Preserve page size if it exists
    const limit = searchParams.get('limit');
    if (limit) params.set('limit', limit);
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    // Navigate to new URL with filters
    router.push(`?${params.toString()}`);
    
    // Call onApply callback if provided (for mobile)
    if (onApply) onApply();
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      gender: '',
      minExperience: '',
      maxFee: '',
      isOnline: false,
      isHomeVisit: false,
      minRating: '',
      sort: 'rating',
    });
    
    // Navigate to URL without filters
    router.push('');
    
    // Call onApply callback if provided (for mobile)
    if (onApply) onApply();
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (name: string, value: boolean) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle radio change
  const handleRadioChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-apollo-blue flex items-center">
          <Filter size={18} className="mr-2" />
          Filters
        </h2>
        <button 
          onClick={resetFilters}
          className="text-sm text-apollo-lightBlue hover:underline"
        >
          Clear All
        </button>
      </div>
      
      {/* Experience Filter */}
      <div className="border-b pb-4 mb-4">
        <button 
          className="w-full flex justify-between items-center mb-3"
          onClick={() => toggleSection('experience')}
        >
          <div className="flex items-center">
            <Award size={16} className="mr-2 text-apollo-blue" />
            <h3 className="font-medium">Experience</h3>
          </div>
          {expandedSections.experience ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
        
        {expandedSections.experience && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="exp-any"
                name="experience"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.minExperience === ''}
                onChange={() => handleRadioChange('minExperience', '')}
              />
              <label htmlFor="exp-any" className="text-sm text-gray-700">
                Any Experience
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="exp-5"
                name="experience"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.minExperience === '5'}
                onChange={() => handleRadioChange('minExperience', '5')}
              />
              <label htmlFor="exp-5" className="text-sm text-gray-700">
                5+ Years
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="exp-10"
                name="experience"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.minExperience === '10'}
                onChange={() => handleRadioChange('minExperience', '10')}
              />
              <label htmlFor="exp-10" className="text-sm text-gray-700">
                10+ Years
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="exp-15"
                name="experience"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.minExperience === '15'}
                onChange={() => handleRadioChange('minExperience', '15')}
              />
              <label htmlFor="exp-15" className="text-sm text-gray-700">
                15+ Years
              </label>
            </div>
          </div>
        )}
      </div>
      
      {/* Gender Filter */}
      <div className="border-b pb-4 mb-4">
        <button 
          className="w-full flex justify-between items-center mb-3"
          onClick={() => toggleSection('gender')}
        >
          <div className="flex items-center">
            <User size={16} className="mr-2 text-apollo-blue" />
            <h3 className="font-medium">Gender</h3>
          </div>
          {expandedSections.gender ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
        
        {expandedSections.gender && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="gender-any"
                name="gender"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.gender === ''}
                onChange={() => handleRadioChange('gender', '')}
              />
              <label htmlFor="gender-any" className="text-sm text-gray-700">
                Any Gender
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="gender-male"
                name="gender"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.gender === 'male'}
                onChange={() => handleRadioChange('gender', 'male')}
              />
              <label htmlFor="gender-male" className="text-sm text-gray-700">
                Male Doctor
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="gender-female"
                name="gender"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.gender === 'female'}
                onChange={() => handleRadioChange('gender', 'female')}
              />
              <label htmlFor="gender-female" className="text-sm text-gray-700">
                Female Doctor
              </label>
            </div>
          </div>
        )}
      </div>
      
      {/* Fee Filter */}
      <div className="border-b pb-4 mb-4">
        <button 
          className="w-full flex justify-between items-center mb-3"
          onClick={() => toggleSection('fee')}
        >
          <div className="flex items-center">
            <span className="mr-2 text-apollo-blue font-medium">₹</span>
            <h3 className="font-medium">Consultation Fee</h3>
          </div>
          {expandedSections.fee ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
        
        {expandedSections.fee && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="fee-any"
                name="fee"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.maxFee === ''}
                onChange={() => handleRadioChange('maxFee', '')}
              />
              <label htmlFor="fee-any" className="text-sm text-gray-700">
                Any Fee
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="fee-500"
                name="fee"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.maxFee === '500'}
                onChange={() => handleRadioChange('maxFee', '500')}
              />
              <label htmlFor="fee-500" className="text-sm text-gray-700">
                Up to ₹500
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="fee-1000"
                name="fee"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.maxFee === '1000'}
                onChange={() => handleRadioChange('maxFee', '1000')}
              />
              <label htmlFor="fee-1000" className="text-sm text-gray-700">
                Up to ₹1000
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="fee-1500"
                name="fee"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.maxFee === '1500'}
                onChange={() => handleRadioChange('maxFee', '1500')}
              />
              <label htmlFor="fee-1500" className="text-sm text-gray-700">
                Up to ₹1500
              </label>
            </div>
          </div>
        )}
      </div>
      
      {/* Availability Type Filter */}
      <div className="border-b pb-4 mb-4">
        <button 
          className="w-full flex justify-between items-center mb-3"
          onClick={() => toggleSection('availability')}
        >
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 text-apollo-blue" />
            <h3 className="font-medium">Availability</h3>
          </div>
          {expandedSections.availability ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
        
        {expandedSections.availability && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="available-online"
                className="mr-2 rounded text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.isOnline}
                onChange={(e) => handleCheckboxChange('isOnline', e.target.checked)}
              />
              <label htmlFor="available-online" className="text-sm text-gray-700 flex items-center">
                <Video size={14} className="mr-1 text-apollo-lightBlue" />
                Online Consultation
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="available-home"
                className="mr-2 rounded text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.isHomeVisit}
                onChange={(e) => handleCheckboxChange('isHomeVisit', e.target.checked)}
              />
              <label htmlFor="available-home" className="text-sm text-gray-700 flex items-center">
                <Home size={14} className="mr-1 text-purple-600" />
                Home Visit
              </label>
            </div>
          </div>
        )}
      </div>
      
      {/* Rating Filter */}
      <div className="pb-4 mb-4">
        <button 
          className="w-full flex justify-between items-center mb-3"
          onClick={() => toggleSection('rating')}
        >
          <div className="flex items-center">
            <Star size={16} className="mr-2 text-apollo-blue" />
            <h3 className="font-medium">Rating</h3>
          </div>
          {expandedSections.rating ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
        
        {expandedSections.rating && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="rating-any"
                name="rating"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.minRating === ''}
                onChange={() => handleRadioChange('minRating', '')}
              />
              <label htmlFor="rating-any" className="text-sm text-gray-700">
                Any Rating
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="rating-3"
                name="rating"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.minRating === '3'}
                onChange={() => handleRadioChange('minRating', '3')}
              />
              <label htmlFor="rating-3" className="text-sm text-gray-700 flex items-center">
                <span className="mr-1">3+</span>
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="rating-4"
                name="rating"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.minRating === '4'}
                onChange={() => handleRadioChange('minRating', '4')}
              />
              <label htmlFor="rating-4" className="text-sm text-gray-700 flex items-center">
                <span className="mr-1">4+</span>
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="rating-4.5"
                name="rating"
                className="mr-2 text-apollo-blue focus:ring-apollo-blue h-4 w-4"
                checked={filters.minRating === '4.5'}
                onChange={() => handleRadioChange('minRating', '4.5')}
              />
              <label htmlFor="rating-4.5" className="text-sm text-gray-700 flex items-center">
                <span className="mr-1">4.5+</span>
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
              </label>
            </div>
          </div>
        )}
      </div>
      
      {/* Apply Button - Visible on Mobile Only */}
      {onApply && (
        <button
          onClick={applyFilters}
          className="w-full bg-apollo-blue text-white py-2 px-4 rounded font-medium hover:bg-opacity-90 transition-colors"
        >
          Apply Filters
        </button>
      )}
    </div>
  );
}