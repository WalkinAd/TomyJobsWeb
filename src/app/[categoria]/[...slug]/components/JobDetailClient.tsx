'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobsService } from '@/feature/jobs/services/jobs.service';
import { categoriesService } from '@/feature/jobs/services/categories.service';
import { parseJobSlug, generateJobUrl, slugify } from '@/feature/jobs/utils/job.utils';
import type { SerializedJob } from '@/feature/jobs/utils/job.serialization';
import type { Job } from '@/feature/jobs/types/job.types';
import { useDeepLink } from '@/shared/hooks/useDeepLink';
import { useTranslations } from '@/shared/hooks/useTranslations';
import ImageCarousel from '@/feature/jobs/components/ImageCarousel/ImageCarousel';
import JobDetailHeader from '@/feature/jobs/components/JobDetailHeader/JobDetailHeader';
import JobDetailContent from '@/feature/jobs/components/JobDetailContent/JobDetailContent';
import JobPublisherInfo from '@/feature/jobs/components/JobPublisherInfo/JobPublisherInfo';
import SimilarJobs from '@/feature/jobs/components/SimilarJobs/SimilarJobs';
import Footer from '@/shared/components/Footer/Footer';
import { JobDetailSkeleton } from '@/shared/components/Skeleton/Skeleton';
import styles from '../page.module.scss';

interface JobDetailClientProps {
  categoria: string;
  slugArray: string[];
  initialJob: SerializedJob | null;
  categoryName?: string;
  subCategoryName?: string;
  categorySlug: string;
  subCategorySlug?: string;
}

export default function JobDetailClient({
  categoria,
  slugArray,
  initialJob,
  categoryName,
  subCategoryName,
  categorySlug,
  subCategorySlug,
}: JobDetailClientProps) {
  const router = useRouter();
  const t = useTranslations('app');
  const tNav = useTranslations('navigation');
  const tJob = useTranslations('jobDetail');
  
  const [job, setJob] = useState<SerializedJob | null>(initialJob);
  const [loading, setLoading] = useState(!initialJob);
  const [similarJobs, setSimilarJobs] = useState<SerializedJob[]>([]);
  const [peopleAlsoSearchFor, setPeopleAlsoSearchFor] = useState<SerializedJob[]>([]);
  const [deepLinkUrl, setDeepLinkUrl] = useState<string | undefined>(undefined);
  const [shouldTryDeepLink, setShouldTryDeepLink] = useState(false);
  const [jobIdForDeepLink, setJobIdForDeepLink] = useState<string>('');

  const { shouldShowWeb } = useDeepLink({
    jobId: jobIdForDeepLink,
    url: deepLinkUrl,
    enabled: shouldTryDeepLink,
  });

  useEffect(() => {
    if (initialJob) {
      setJob(initialJob);
      setLoading(false);
      loadRelatedJobs(initialJob);
      setupDeepLink(initialJob);
    } else if (shouldShowWeb) {
      loadJob();
    }
  }, [initialJob, shouldShowWeb]);

  const loadJob = async () => {
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
      setTimeout(() => {
        router.push('/');
      }, 1000);
      return;
    }

    try {
      setLoading(true);
      const jobData = await jobsService.getJobByLocator(extractedLocator);
      
      if (!jobData) {
        router.push('/');
        return;
      }

      const { serializeJob } = await import('@/feature/jobs/utils/job.serialization');
      const serializedJob = serializeJob(jobData);
      setJob(serializedJob);
      loadRelatedJobs(serializedJob);
      setupDeepLink(serializedJob);
    } catch (error) {
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedJobs = async (jobData: SerializedJob) => {
    const { serializeJobs } = await import('@/feature/jobs/utils/job.serialization');
    
    if (jobData.subCatId && jobData.location) {
      const similar = await jobsService.getSimilarJobs(
        jobData.subCatId,
        jobData.location,
        jobData.docId
      );
      setSimilarJobs(serializeJobs(similar));
    }

    if (jobData.subCatId) {
      const peopleAlsoSearch = await jobsService.getJobsBySubCategory(
        jobData.subCatId,
        jobData.docId
      );
      setPeopleAlsoSearchFor(serializeJobs(peopleAlsoSearch));
    }
  };

  const setupDeepLink = (jobData: SerializedJob) => {
    if (!jobData.locator) return;

    const correctUrl = generateJobUrl(categorySlug, jobData.title || '', jobData.locator, subCategorySlug);
    const fullUrl = `${window.location.origin}${correctUrl}`;
    setDeepLinkUrl(fullUrl);
    setJobIdForDeepLink(jobData.docId);
    setShouldTryDeepLink(true);
  };

  if (!initialJob && !shouldShowWeb) {
    return (
      <>
        <JobDetailSkeleton />
        <Footer showAppPromo={false} />
      </>
    );
  }

  if (!initialJob && loading) {
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
              <JobDetailContent job={job} categoryName={categoryName} subCategoryName={subCategoryName} />
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

