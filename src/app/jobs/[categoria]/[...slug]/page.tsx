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
    if (slugArray.length > 1) {
      subCategoriaFromUrl = decodeURIComponent(slugArray[0]);
      jobSlugFromUrl = slugArray.slice(1).join('/');
    } else {
      jobSlugFromUrl = slugArray.join('/');
    }
  }
  
  const slug = jobSlugFromUrl ? decodeURIComponent(jobSlugFromUrl) : '';
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [peopleAlsoSearchFor, setPeopleAlsoSearchFor] = useState<Job[]>([]);
  const [locator, setLocator] = useState<string | null>(null);
  const [categorySlug, setCategorySlug] = useState<string>(categoria);
  const [subCategorySlug, setSubCategorySlug] = useState<string | undefined>(subCategoriaFromUrl);
  const [categoryName, setCategoryName] = useState<string | undefined>(undefined);
  const [subCategoryName, setSubCategoryName] = useState<string | undefined>(undefined);

  const parsedSlug = slug ? parseJobSlug(slug) : null;
  const extractedLocator = parsedSlug?.locator || null;
  const [deepLinkUrl, setDeepLinkUrl] = useState<string | undefined>(undefined);
  const [shouldTryDeepLink, setShouldTryDeepLink] = useState(false);
  const [jobIdForDeepLink, setJobIdForDeepLink] = useState<string>('');

  const { shouldShowWeb } = useDeepLink({
    jobId: jobIdForDeepLink,
    url: deepLinkUrl,
    enabled: shouldTryDeepLink,
  });

  useEffect(() => {
    if (extractedLocator) {
      setLocator(extractedLocator);
    }
  }, [extractedLocator]);

  useEffect(() => {
    if (locator && shouldShowWeb) {
      loadJob();
    }
  }, [locator, shouldShowWeb]);

  useEffect(() => {
    if (!extractedLocator && slug && shouldShowWeb) {
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  }, [extractedLocator, slug, shouldShowWeb, router]);

  const loadJob = async () => {
    if (!locator) return;

    try {
      setLoading(true);
      const jobData = await jobsService.getJobByLocator(locator);
      
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
          setCategoryName(category.name);
        }
      }
      
      if (jobData.subCatId) {
        const subCategory = allCategories.find((cat) => cat.docId === jobData.subCatId);
        if (subCategory) {
          finalSubCategorySlug = slugify(subCategory.name);
          setSubCategoryName(subCategory.name);
        }
      }
      
      setCategorySlug(finalCategorySlug);
      setSubCategorySlug(finalSubCategorySlug);

      if (!jobData.locator) {
        router.push('/');
        return;
      }

      const correctUrl = generateJobUrl(finalCategorySlug, jobData.title || '', jobData.locator, finalSubCategorySlug);
      const currentPath = window.location.pathname.replace(/\/$/, '');
      if (currentPath !== correctUrl) {
        window.history.replaceState({}, '', correctUrl);
      }

      const fullUrl = `${window.location.origin}${correctUrl}`;
      setDeepLinkUrl(fullUrl);
      setJobIdForDeepLink(jobData.docId);
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

  if (!locator) {
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

