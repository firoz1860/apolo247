"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Award,
  Star,
  User,
  Calendar,
  Video,
  Home,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface FilterSidebarProps {
  onApply?: () => void;
}

export default function FilterSidebar({ onApply }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [expandedSections, setExpandedSections] = useState({
    experience: true,
    gender: true,
    fee: true,
    availability: true,
    rating: true,
  });

  const [filters, setFilters] = useState({
    gender: "",
    minExperience: "",
    maxFee: "",
    isOnline: false,
    isHomeVisit: false,
    minRating: "",
    sort: "rating",
  });

  useEffect(() => {
    if (!searchParams) return;

    setFilters({
      gender: searchParams.get("gender") || "",
      minExperience: searchParams.get("minExperience") || "",
      maxFee: searchParams.get("maxFee") || "",
      isOnline: searchParams.get("isOnline") === "true",
      isHomeVisit: searchParams.get("isHomeVisit") === "true",
      minRating: searchParams.get("minRating") || "",
      sort: searchParams.get("sort") || "rating",
    });
  }, [searchParams]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const handleChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.gender) params.set("gender", filters.gender);
    if (filters.minExperience)
      params.set("minExperience", filters.minExperience);
    if (filters.maxFee) params.set("maxFee", filters.maxFee);
    if (filters.minRating) params.set("minRating", filters.minRating);
    if (filters.isOnline) params.set("isOnline", "true");
    if (filters.isHomeVisit) params.set("isHomeVisit", "true");
    if (filters.sort) params.set("sort", filters.sort);

    const limit = searchParams?.get("limit");
    if (limit) params.set("limit", limit);

    params.set("page", "1");

    router.push(`?${params.toString()}`);
    if (onApply) onApply();
  };

  const resetFilters = () => {
    setFilters({
      gender: "",
      minExperience: "",
      maxFee: "",
      isOnline: false,
      isHomeVisit: false,
      minRating: "",
      sort: "rating",
    });

    const newParams = new URLSearchParams();
    newParams.set("page", "1");

    router.push(`?${newParams.toString()}`);
    if (onApply) onApply();
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      {/* Filter Header */}
      <div className="flex items-center gap-2 text-xl font-semibold mb-4">
        <Filter className="w-5 h-5" />
        Filters
      </div>

      {/* Experience Section */}
      <div>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("experience")}
        >
          <div className="flex items-center gap-2 font-medium">
            <Award className="w-4 h-4" />
            Experience
          </div>
          {expandedSections.experience ? <ChevronUp /> : <ChevronDown />}
        </div>

        {expandedSections.experience && (
          <div className="mt-2 space-y-2 px-1">
            <label
              htmlFor="experience-range"
              className="text-sm text-gray-700 block"
            >
              Minimum Experience: {filters.minExperience || 0} yrs
            </label>
            <input
              id="experience-range"
              type="range"
              min="0"
              max="30"
              step="1"
              value={filters.minExperience || 0}
              onChange={(e) => handleChange("minExperience", e.target.value)}
              className="w-full accent-apollo-blue"
            />
          </div>
        )}
      </div>

      {/* Gender Section */}
      <div className="mt-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("gender")}
        >
          <div className="flex items-center gap-2 font-medium">
            <User className="w-4 h-4" />
            Gender
          </div>
          {expandedSections.gender ? <ChevronUp /> : <ChevronDown />}
        </div>
        {expandedSections.gender && (
          <div className="mt-2">
            <select
              className="w-full mt-1 p-2 border rounded"
              value={filters.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        )}
      </div>

      {/* Fee Section */}
      <div className="mt-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("fee")}
        >
          <div className="flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4" />
            Max Fee
          </div>
          {expandedSections.fee ? <ChevronUp /> : <ChevronDown />}
        </div>

        {expandedSections.fee && (
          <div className="mt-2 space-y-2 px-1">
            <label htmlFor="fee-range" className="text-sm text-gray-700 block">
              Max Fee: ₹{filters.maxFee || 0}
            </label>
            <input
              id="fee-range"
              type="range"
              min="0"
              max="5000"
              step="100"
              value={filters.maxFee || 0}
              onChange={(e) => handleChange("maxFee", e.target.value)}
              className="w-full accent-apollo-blue"
            />
          </div>
        )}
      </div>

      {/* Availability Section */}
      <div className="mt-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("availability")}
        >
          <div className="flex items-center gap-2 font-medium">
            <Video className="w-4 h-4" />
            Availability
          </div>
          {expandedSections.availability ? <ChevronUp /> : <ChevronDown />}
        </div>
        {expandedSections.availability && (
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.isOnline}
                onChange={(e) => handleChange("isOnline", e.target.checked)}
              />
              Online
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.isHomeVisit}
                onChange={(e) => handleChange("isHomeVisit", e.target.checked)}
              />
              Home Visit
            </label>
          </div>
        )}
      </div>

      {/* Rating Section */}
      <div className="mt-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("rating")}
        >
          <div className="flex items-center gap-2 font-medium">
            <Star className="w-4 h-4" />
            Min Rating
          </div>
          {expandedSections.rating ? <ChevronUp /> : <ChevronDown />}
        </div>
        {expandedSections.rating && (
          <div className="mt-2">
            <select
              className="w-full mt-1 p-2 border rounded"
              value={filters.minRating}
              onChange={(e) => handleChange("minRating", e.target.value)}
            >
              <option value="">All</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5</option>
            </select>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-6">
        <button
          className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
          onClick={resetFilters}
        >
          Reset
        </button>
        <button
          className="w-1/2 w-full py-2 px-4 bg-apollo-blue text-white rounded"
          onClick={applyFilters}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
