import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { jobsService } from '@/feature/jobs/services/jobs.service';
import { categoriesService } from '@/feature/jobs/services/categories.service';
import { parseJobSlug, generateJobUrl, slugify, getJobImageUrl } from '@/feature/jobs/utils/job.utils';
import { serializeJob } from '@/feature/jobs/utils/job.serialization';
import JobDetailClient from './components/JobDetailClient';
import StructuredData from './components/StructuredData';

interface JobDetailPageProps {
  params: Promise<{
    categoria: string;
    slug: string[];
  }>;
}

async function getJobData(categoria: string, slugArray: string[]) {
  try {
    let subCategoriaFromUrl: string | undefined = undefined;
    let jobSlugFromUrl: string = '';
    
    if (slugArray && slugArray.length > 0) {
      if (slugArray.length > 1) {
        subCategoriaFromUrl = decodeURIComponent(slugArray[0]);
        jobSlugFromUrl = slugArray.slice(1).join('/');
      } else {
        jobSlugFromUrl = slugArray.join('/');
      }
    }
    
    const slug = jobSlugFromUrl ? decodeURIComponent(jobSlugFromUrl) : '';
    const parsedSlug = slug ? parseJobSlug(slug) : null;
    const extractedLocator = parsedSlug?.locator || null;

    if (!extractedLocator) {
      return null;
    }

    const job = await jobsService.getJobByLocator(extractedLocator);
    
    if (!job) {
      return null;
    }

    const expireDate = job.expireTimestamp ? new Date(job.expireTimestamp) : undefined;
    if (expireDate && expireDate < new Date()) {
      return null;
    }

    if (job.status?.toLowerCase().includes("pen") || job.status?.toLowerCase().includes("rej")) {
      return null;
    }

  const allCategories = await categoriesService.getAllCategories();
  
  let finalCategorySlug = categoria;
  let finalSubCategorySlug: string | undefined = undefined;
  let categoryName: string | undefined = undefined;
  let subCategoryName: string | undefined = undefined;
  
  if (job.catId) {
    const category = allCategories.find((cat) => cat.docId === job.catId);
    if (category) {
      finalCategorySlug = slugify(category.name);
      categoryName = category.name;
    }
  }
  
  if (job.subCatId) {
    const subCategory = allCategories.find((cat) => cat.docId === job.subCatId);
    if (subCategory) {
      finalSubCategorySlug = slugify(subCategory.name);
      subCategoryName = subCategory.name;
    }
  }

    return {
      job,
      categorySlug: finalCategorySlug,
      subCategorySlug: finalSubCategorySlug,
      categoryName,
      subCategoryName,
    };
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { categoria, slug } = await params;
  const slugArray = Array.isArray(slug) ? slug : [slug];
  
  const data = await getJobData(categoria, slugArray);
  
  if (!data || !data.job) {
    return {
      title: 'Trabajo no encontrado',
      description: 'El trabajo que buscas no existe o ha sido eliminado.',
    };
  }

  const { job, categorySlug, subCategorySlug } = data;
  const jobUrl = generateJobUrl(categorySlug, job.title || '', job.locator || '', subCategorySlug);
  const fullUrl = `https://tomyjobs.com${jobUrl}`;
  const imageUrl = getJobImageUrl(job.banner);
  const description = job.description 
    ? job.description.substring(0, 160).replace(/\n/g, ' ').trim() + '...'
    : `Oferta de trabajo: ${job.title || ''} en ${job.location || ''}`;

  return {
    title: `${job.title || 'Trabajo'} | TomyJobs`,
    description,
    keywords: [
      job.title || '',
      job.location || '',
      'trabajo',
      'empleo',
      'oferta de trabajo',
      categorySlug,
      subCategorySlug || '',
    ].filter(Boolean),
    openGraph: {
      title: `${job.title || 'Trabajo'} | TomyJobs`,
      description,
      url: fullUrl,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: job.title || 'Trabajo',
        },
      ],
      siteName: 'TomyJobs',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.title || 'Trabajo'} | TomyJobs`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: jobUrl,
    },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { categoria, slug } = await params;
  const slugArray = Array.isArray(slug) ? slug : [slug];
  
  const data = await getJobData(categoria, slugArray);
  
  if (!data || !data.job) {
    notFound();
  }

  const { job, categorySlug, subCategorySlug, categoryName, subCategoryName } = data;
  const serializedJob = serializeJob(job);

  return (
    <>
      <StructuredData job={serializedJob} categoryName={categoryName} subCategoryName={subCategoryName} />
      <JobDetailClient
        categoria={categoria}
        slugArray={slugArray}
        initialJob={serializedJob}
        categoryName={categoryName}
        subCategoryName={subCategoryName}
        categorySlug={categorySlug}
        subCategorySlug={subCategorySlug}
      />
    </>
  );
}

