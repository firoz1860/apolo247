'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, SortAsc, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const sortOptions = [
  { value: 'rating', label: 'Relevance' },
  { value: 'experience-high', label: 'Experience: High to Low' },
  { value: 'experience-low', label: 'Experience: Low to High' },
  { value: 'fee-high', label: 'Fee: High to Low' },
  { value: 'fee-low', label: 'Fee: Low to High' },
];

export default function SortOptions() {
  const router = useRouter();
  const rawSearchParams = useSearchParams();
const searchParams = rawSearchParams || new URLSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get current sort option
  const currentSort = searchParams.get('sort') || 'rating';
  const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Relevance';
  
  // Handle sort option selection
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    
    // Reset to page 1 when sort changes
    params.set('page', '1');
    
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm bg-white border border-gray-200 rounded-md px-3 py-2 hover:border-gray-300"
      >
        <SortAsc size={16} className="text-gray-500" />
        <span className="text-gray-700">Sort by: {currentSortLabel}</span>
        <ChevronDown 
          size={16} 
          className={cn(
            "text-gray-500 transition-transform duration-200",
            isOpen ? "transform rotate-180" : ""
          )}
        />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white shadow-lg rounded-md z-10 py-1 border border-gray-200">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={cn(
                "w-full text-left px-4 py-2 text-sm flex items-center justify-between",
                currentSort === option.value
                  ? "bg-gray-50 text-apollo-blue font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {option.label}
              {currentSort === option.value && (
                <Check size={16} className="text-apollo-blue" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}