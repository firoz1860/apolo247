import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Mail, Phone } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Services',
    links: [
      { label: 'Consult a Doctor', href: '/find-doctors' },
      { label: 'Pharmacy', href: '/pharmacy' },
      { label: 'Lab Tests', href: '/lab-tests' },
      { label: 'Health Records', href: '/health-records' },
      { label: 'My Appointments', href: '/appointments' },
      { label: 'My Orders', href: '/orders' },
      { label: 'My Profile', href: '/profile' },
    ],
  },
  {
    title: 'Specialties',
    links: [
      { label: 'General Physician', href: '/specialties/general-physician-internal-medicine' },
      { label: 'Cardiology', href: '/specialties/cardiology' },
      { label: 'Neurology', href: '/specialties/neurology' },
      { label: 'Orthopedics', href: '/specialties/orthopedics' },
      { label: 'Pediatrics', href: '/specialties/pediatrics' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/info/about' },
      { label: 'Careers', href: '/info/careers' },
      { label: 'Contact Us', href: '/info/contact' },
      { label: 'Help & FAQ', href: '/info/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/info/privacy' },
      { label: 'Terms & Conditions', href: '/info/terms' },
      { label: 'Returns & Refunds', href: '/info/returns' },
    ],
  },
];

const socials = [
  { label: 'Facebook', href: '#', icon: Facebook },
  { label: 'Twitter', href: '#', icon: Twitter },
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'YouTube', href: '#', icon: Youtube },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="apollo-container py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center mb-3">
              <span className="text-white font-bold text-2xl">Apollo</span>
              <span className="text-apollo-orange font-bold text-2xl">247</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted partner for online consultations, medicines and lab tests.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> New Delhi, India
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@apollo247.local
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> 1860-500-0247
              </li>
            </ul>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-white font-semibold mb-3">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="apollo-container py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {year} Apollo 247 (demo). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socials.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
