/**
 * Content for the informational footer pages. Driving them from data keeps the
 * routes dynamic — one route renders every page, and adding a page is just a
 * new entry here (which also updates the footer links and static params).
 */

export interface InfoSection {
  heading?: string;
  body: string[];
}

export interface InfoPage {
  slug: string;
  title: string;
  description: string;
  sections: InfoSection[];
}

export const infoPages: InfoPage[] = [
  {
    slug: 'about',
    title: 'About Us',
    description: 'Learn about Apollo 247 and our mission.',
    sections: [
      {
        body: [
          'Apollo 247 is a digital healthcare platform that brings doctors, medicines and diagnostic tests together in one place. Our mission is to make quality healthcare accessible to everyone, anytime.',
        ],
      },
      {
        heading: 'What we offer',
        body: [
          'Online and in-clinic doctor consultations across specialties.',
          'A pharmacy for genuine medicines and health products.',
          'Diagnostic lab tests with convenient home sample collection.',
          'A single place to keep your health records.',
        ],
      },
    ],
  },
  {
    slug: 'careers',
    title: 'Careers',
    description: 'Join the team building the future of digital healthcare.',
    sections: [
      {
        body: [
          'We are always looking for engineers, clinicians, designers and operators who care about improving healthcare outcomes at scale.',
          'This is a demo project, so there are no live openings — but we would love talented people who share our mission.',
        ],
      },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact Us',
    description: 'Get in touch with Apollo 247 support.',
    sections: [
      {
        heading: 'Customer support',
        body: ['Email: support@apollo247.local', 'Phone: 1860-500-0247 (9 AM – 9 PM)'],
      },
      {
        heading: 'Registered office',
        body: ['Apollo 247, MG Road, New Delhi, 110001, India'],
      },
    ],
  },
  {
    slug: 'faq',
    title: 'Help & FAQ',
    description: 'Answers to common questions.',
    sections: [
      {
        heading: 'How do I book an appointment?',
        body: [
          'Open a doctor from Find Doctors, choose a consultation type, pick a date and an available slot, then confirm. You need to be signed in (a guest session works too).',
        ],
      },
      {
        heading: 'How do payments work?',
        body: [
          'This is a demo environment. Orders and bookings use a mock payment step — no real money is charged.',
        ],
      },
      {
        heading: 'Can I cancel or reschedule?',
        body: ['Yes. Go to My Appointments to cancel or reschedule a booked appointment.'],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    description: 'How we handle your data.',
    sections: [
      {
        body: [
          'We collect only the information needed to provide the service — your name, email, and the appointments, orders and bookings you create.',
          'Passwords are stored hashed. We never sell your personal data. This is a demo application and should not be used with real personal health information.',
        ],
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    description: 'The terms of using Apollo 247.',
    sections: [
      {
        body: [
          'By using this platform you agree to use it lawfully and to provide accurate information.',
          'This is a demonstration application. It does not provide real medical advice, and the doctors, medicines and tests shown are sample data.',
        ],
      },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns & Refunds',
    description: 'Our returns and refunds policy.',
    sections: [
      {
        body: [
          'Medicines can be returned within 7 days of delivery if unopened and in their original packaging.',
          'Refunds for cancelled lab tests are processed within 5–7 business days. As this is a demo, no real transactions occur.',
        ],
      },
    ],
  },
];

const bySlug = new Map(infoPages.map((p) => [p.slug, p]));

export function getInfoPage(slug: string): InfoPage | undefined {
  return bySlug.get(slug);
}

export const infoSlugs = infoPages.map((p) => p.slug);
