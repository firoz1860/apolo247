import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getInfoPage, infoSlugs } from '@/lib/content/pages';

export function generateStaticParams() {
  return infoSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getInfoPage(params.slug);
  if (!page) return { title: 'Not found | Apollo 247' };
  return { title: `${page.title} | Apollo 247`, description: page.description };
}

export default function InfoPage({ params }: { params: { slug: string } }) {
  const page = getInfoPage(params.slug);
  if (!page) notFound();

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="bg-apollo-blue py-8 md:py-12">
        <div className="apollo-container">
          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            {page.title}
          </h1>
          <p className="text-white/90 text-sm md:text-base max-w-3xl">{page.description}</p>
        </div>
      </section>

      <article className="apollo-container py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 space-y-6">
          {page.sections.map((section, idx) => (
            <section key={idx}>
              {section.heading && (
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{section.heading}</h2>
              )}
              <div className="space-y-2 text-gray-600 leading-relaxed">
                {section.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
