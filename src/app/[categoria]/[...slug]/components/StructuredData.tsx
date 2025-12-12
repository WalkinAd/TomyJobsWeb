import { generateJobUrl, slugify, getJobImageUrl } from '@/feature/jobs/utils/job.utils';
import type { SerializedJob } from '@/feature/jobs/utils/job.serialization';

interface StructuredDataProps {
  job: SerializedJob;
  categoryName?: string;
  subCategoryName?: string;
}

export default function StructuredData({ job, categoryName, subCategoryName }: StructuredDataProps) {
  const baseUrl = 'https://tomyjobs.com';
  const categorySlug = categoryName ? slugify(categoryName) : 'general';
  const subCategorySlug = subCategoryName ? slugify(subCategoryName) : undefined;
  const jobUrl = generateJobUrl(categorySlug, job.title || '', job.locator || '', subCategorySlug);
  const fullUrl = `${baseUrl}${jobUrl}`;
  const imageUrl = getJobImageUrl(job.banner);

  const getDatePosted = (): string => {
    if (!job.timestamp) return new Date().toISOString();
    if (typeof job.timestamp === 'string') return job.timestamp;
    return new Date().toISOString();
  };

  const jobPosting = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title || '',
    description: job.description || '',
    identifier: {
      '@type': 'PropertyValue',
      name: 'TomyJobs',
      value: job.locator || job.docId,
    },
    datePosted: getDatePosted(),
    validThrough: job.expireTimestamp ? new Date(job.expireTimestamp).toISOString() : undefined,
    employmentType: job.hiringType || 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.createdByCompanyId ? 'Empresa' : 'Usuario',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || '',
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'EUR',
    },
    url: fullUrl,
    image: imageUrl,
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'TomyJobs',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Trabajos',
        item: `${baseUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName || 'Categoría',
        item: `${baseUrl}/${categorySlug}`,
      },
      ...(subCategoryName
        ? [
            {
              '@type': 'ListItem',
              position: 4,
              name: subCategoryName,
              item: `${baseUrl}/${categorySlug}/${subCategorySlug}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: subCategoryName ? 5 : 4,
        name: job.title || 'Trabajo',
        item: fullUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
    </>
  );
}

