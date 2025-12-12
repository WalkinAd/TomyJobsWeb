import { Category } from '@/feature/jobs/types/category.types';
import type { SerializedJob } from '@/feature/jobs/utils/job.serialization';

interface HomeStructuredDataProps {
  jobs: SerializedJob[];
  categories: Category[];
}

export default function HomeStructuredData({ jobs, categories }: HomeStructuredDataProps) {
  const baseUrl = 'https://tomyjobs.com';

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TomyJobs',
    url: baseUrl,
    description: 'Plataforma para encontrar y publicar trabajos. Miles de ofertas de empleo en diferentes categorías y ubicaciones.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TomyJobs',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
    },
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: jobs.length,
    itemListElement: jobs.slice(0, 10).map((job, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'JobPosting',
        title: job.title || '',
        description: job.description?.substring(0, 200) || '',
        identifier: {
          '@type': 'PropertyValue',
          name: 'TomyJobs',
          value: job.locator || job.docId,
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.location || '',
          },
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      {jobs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
        />
      )}
    </>
  );
}

