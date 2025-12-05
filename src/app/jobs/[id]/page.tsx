'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jobsService } from '@/feature/jobs/services/jobs.service';
import { Job } from '@/feature/jobs/types/job.types';
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
  const jobId = params.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [peopleAlsoSearchFor, setPeopleAlsoSearchFor] = useState<Job[]>([]);

  useEffect(() => {
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const jobData = await jobsService.getJobById(jobId);
      
      if (!jobData) {
        router.push('/');
        return;
      }

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
      console.error('error loading job:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

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
            <button
              className={styles.breadcrumbLink}
              onClick={() => router.push('/')}
            >
              {tNav('jobs')}
            </button>
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
              <JobPublisherInfo job={job} />
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
