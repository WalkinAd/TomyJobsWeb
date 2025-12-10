'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jobsService } from '@/feature/jobs/services/jobs.service';
import { categoriesService } from '@/feature/jobs/services/categories.service';
import { Job } from '@/feature/jobs/types/job.types';
import { parseJobSlug, generateJobUrl, slugify } from '@/feature/jobs/utils/job.utils';
import { useDeepLink } from '@/shared/hooks/useDeepLink';
import { useTranslations } from '@/shared/hooks/useTranslations';
import ImageCarousel from '@/feature/jobs/components/ImageCarousel/ImageCarousel';
import JobDetailHeader from '@/feature/jobs/components/JobDetailHeader/JobDetailHeader';
import JobDetailContent from '@/feature/jobs/components/JobDetailContent/JobDetailContent';
import JobPublisherInfo from '@/feature/jobs/components/JobPublisherInfo/JobPublisherInfo';
import SimilarJobs from '@/feature/jobs/components/SimilarJobs/SimilarJobs';
import Footer from '@/shared/components/Footer/Footer';
import { JobDetailSkeleton } from '@/shared/components/Skeleton/Skeleton';
import styles from './page.module.scss';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('app');
  const tNav = useTranslations('navigation');
  const tJob = useTranslations('jobDetail');
  
  const categoria = params.categoria as string;
  const slugArray = params.slug as string[];
  
  let subCategoriaFromUrl: string | undefined = undefined;
  let jobSlugFromUrl: string = '';
  
  if (slugArray && slugArray.length > 0) {
    const firstItem = slugArray[0];
    const hasJobId = firstItem.includes('&');
    
    if (hasJobId) {
      jobSlugFromUrl = slugArray.join('/');
    } else {
      if (slugArray.length > 1) {
        subCategoriaFromUrl = decodeURIComponent(firstItem);
        jobSlugFromUrl = slugArray.slice(1).join('/');
      } else {
        jobSlugFromUrl = firstItem;
      }
    }
  }
  
  const slug = jobSlugFromUrl ? decodeURIComponent(jobSlugFromUrl) : '';
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [peopleAlsoSearchFor, setPeopleAlsoSearchFor] = useState<Job[]>([]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [categorySlug, setCategorySlug] = useState<string>(categoria);
  const [subCategorySlug, setSubCategorySlug] = useState<string | undefined>(subCategoriaFromUrl);

  const parsedSlug = slug ? parseJobSlug(slug) : null;
  const extractedJobId = parsedSlug?.jobId || null;
  const [deepLinkUrl, setDeepLinkUrl] = useState<string | undefined>(undefined);
  const [shouldTryDeepLink, setShouldTryDeepLink] = useState(false);

  const { shouldShowWeb } = useDeepLink({
    jobId: extractedJobId || '',
    url: deepLinkUrl,
    enabled: shouldTryDeepLink,
  });

  useEffect(() => {
    if (extractedJobId) {
      setJobId(extractedJobId);
    }
  }, [extractedJobId]);

  useEffect(() => {
    if (jobId && shouldShowWeb) {
      loadJob();
    }
  }, [jobId, shouldShowWeb]);

  useEffect(() => {
    if (!extractedJobId && slug && shouldShowWeb) {
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  }, [extractedJobId, slug, shouldShowWeb, router]);

  const loadJob = async () => {
    if (!jobId) return;

    try {
      setLoading(true);
      const jobData = await jobsService.getJobById(jobId);
      
      if (!jobData) {
        router.push('/');
        return;
      }

      let finalCategorySlug = categoria;
      let finalSubCategorySlug: string | undefined = undefined;
      
      const allCategories = await categoriesService.getAllCategories();
      
      if (jobData.catId) {
        const category = allCategories.find((cat) => cat.docId === jobData.catId);
        if (category) {
          finalCategorySlug = slugify(category.name);
        }
      }
      
      if (jobData.subCatId) {
        const subCategory = allCategories.find((cat) => cat.docId === jobData.subCatId);
        if (subCategory) {
          finalSubCategorySlug = slugify(subCategory.name);
        }
      }
      
      setCategorySlug(finalCategorySlug);
      setSubCategorySlug(finalSubCategorySlug);

      const correctUrl = generateJobUrl(finalCategorySlug, jobData.title || '', jobData.docId, finalSubCategorySlug);
      const currentPath = window.location.pathname.replace(/\/$/, '');
      if (currentPath !== correctUrl) {
        window.history.replaceState({}, '', correctUrl);
      }

      const fullUrl = `${window.location.origin}${correctUrl}`;
      setDeepLinkUrl(fullUrl);
      setShouldTryDeepLink(true);

      setJob(jobData);

      if (jobData.subCatId && jobData.location) {
        const similar = await jobsService.getSimilarJobs(
          jobData.subCatId,
          jobData.location,
          jobData.docId
        );
        setSimilarJobs(similar);
      }

      if (jobData.subCatId) {
        const peopleAlsoSearch = await jobsService.getJobsBySubCategory(
          jobData.subCatId,
          jobData.docId
        );
        setPeopleAlsoSearchFor(peopleAlsoSearch);
      }
    } catch (error) {
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  if (!shouldShowWeb) {
    return (
      <>
        <JobDetailSkeleton />
        <Footer showAppPromo={false} />
      </>
    );
  }

  if (!jobId) {
    return (
      <>
        <JobDetailSkeleton />
        <Footer showAppPromo={false} />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <JobDetailSkeleton />
        <Footer showAppPromo={false} />
      </>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={`px-xl py-xl ${styles.mainLayout}`}>
          <div className={`flex-row items-center gap-xs flex-wrap mb-m ${styles.breadcrumbs}`}>
            <button
              className={styles.breadcrumbLink}
              onClick={() => router.push('/')}
            >
              {t('name')}
            </button>
            <span className={styles.separator}>/</span>
            <span className={styles.breadcrumbText}>
              {tNav('jobs')}
            </span>
            <span className={styles.separator}>/</span>
            <span className={styles.breadcrumbText}>
              {categoria}
            </span>
            {subCategorySlug && (
              <>
                <span className={styles.separator}>/</span>
                <span className={styles.breadcrumbText}>
                  {subCategorySlug}
                </span>
              </>
            )}
            <span className={styles.separator}>/</span>
            <span className={styles.breadcrumbCurrent}>
              {job.title || 'job'}
            </span>
          </div>
          <div className={`flex-row items-start ${styles.columnsLayout}`} style={{ gap: '12px' }}>
            <div className={styles.leftColumn}>
              <ImageCarousel images={job.banner || []} title={job.title || ''} />
              <JobDetailContent job={job} />
            </div>
            <div className={styles.rightColumn}>
              <JobPublisherInfo job={job} categorySlug={categorySlug} subCategorySlug={subCategorySlug} />
            </div>
          </div>
        </div>
        {similarJobs.length > 0 && (
          <SimilarJobs jobs={similarJobs} currentJobId={job.docId} />
        )}
        {peopleAlsoSearchFor.length > 0 && (
          <SimilarJobs 
            jobs={peopleAlsoSearchFor} 
            currentJobId={job.docId}
            title={tJob('lbl_people_also_search_for')}
          />
        )}
      </div>
      <JobDetailHeader job={job} />
      <Footer showAppPromo={false} />
    </>
  );
}

