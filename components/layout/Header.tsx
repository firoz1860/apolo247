"use client";

import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Search,
  Menu,
  X,
  User,
  ShoppingCart,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useState("Delhi");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/login"; // Refresh to update UI
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-apollo-blue text-white text-sm py-1">
        <div className="apollo-container flex justify-between items-center">
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="hover:text-apollo-orange transition-colors"
            >
              Consult
            </Link>
            <Link
              href="/"
              className="hover:text-apollo-orange transition-colors"
            >
              Order Medicines
            </Link>
            <Link
              href="/"
              className="hover:text-apollo-orange transition-colors"
            >
              Lab Tests
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="hover:text-apollo-orange transition-colors"
            >
              Need Help?
            </Link>
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="apollo-container py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-32 h-10">
              <div className="flex items-center">
                <div className="text-apollo-blue font-bold text-2xl">
                  Apollo
                </div>
                <div className="text-apollo-orange font-bold text-2xl">247</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/specialties"
              className="text-apollo-blue font-medium hover:text-apollo-lightBlue transition-colors"
            >
              Find Doctors
            </Link>
            <Link
              href="/"
              className="text-apollo-blue font-medium hover:text-apollo-lightBlue transition-colors"
            >
              Consult
            </Link>
            <Link
              href="/"
              className="text-apollo-blue font-medium hover:text-apollo-lightBlue transition-colors"
            >
              Pharmacy
            </Link>
            <Link
              href="/"
              className="text-apollo-blue font-medium hover:text-apollo-lightBlue transition-colors"
            >
              Lab Tests
            </Link>
            <Link
              href="/"
              className="text-apollo-blue font-medium hover:text-apollo-lightBlue transition-colors"
            >
              Health Records
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center text-apollo-blue hover:text-apollo-lightBlue transition-colors">
              <Search size={20} />
            </button>
            <button className="hidden md:flex items-center text-apollo-blue hover:text-apollo-lightBlue transition-colors">
              <ShoppingCart size={20} />
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center text-red-600 hover:text-red-400 transition-colors"
              >
                <User size={20} />
                <span className="ml-1 font-medium">Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center text-apollo-blue hover:text-apollo-lightBlue transition-colors"
              >
                <User size={20} />
                <span className="ml-1 font-medium">Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-apollo-blue"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsMenuOpen(false)}>
            <X size={24} className="text-apollo-blue" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-6">
          <Link
            href="/specialties"
            className="block text-apollo-blue font-medium hover:text-apollo-lightBlue transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Find Doctors
          </Link>
          <Link
            href="/"
            className="block text-apollo-blue font-medium hover:text-apollo-lightBlue transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Consult
          </Link>
          <Link
            href="/"
            className="block text-apollo-blue font-medium hover:text-apollo-lightBlue transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Pharmacy
          </Link>
          <Link
            href="/"
            className="block text-apollo-blue font-medium hover:text-apollo-lightBlue transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Lab Tests
          </Link>
          <Link
            href="/"
            className="block text-apollo-blue font-medium hover:text-apollo-lightBlue transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Health Records
          </Link>
          <div className="pt-6 border-t border-gray-200 px-6">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center text-red-600 font-medium hover:underline"
              >
                <User size={20} className="mr-2" />
                Logout
              </button>
            ) : (
              <Link
                href="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-apollo-blue font-medium hover:underline"
              >
                <User size={20} className="mr-2" />
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
