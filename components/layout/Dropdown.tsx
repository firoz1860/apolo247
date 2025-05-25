"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface DropdownProps {
  title: string;
  items: { label: string; href: string }[];
}

const Dropdown = ({ title, items }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Label/Button for desktop hover + mobile tap */}
      <button
        onClick={() => setIsOpen(!isOpen)} // for mobile tap
        className="cursor-pointer text-apollo-blue font-medium hover:text-apollo-lightBlue transition-colors select-none focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {title}
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute left-0 top-full mt-2 bg-white border shadow-md rounded-md min-w-[200px] z-50 transition-all duration-200 ease-in-out
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-apollo-lightBlue hover:text-white transition"
            onClick={() => setIsOpen(false)} // close on mobile click
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
