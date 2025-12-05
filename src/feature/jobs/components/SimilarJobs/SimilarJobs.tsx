'use client';

import { useRouter } from 'next/navigation';
import { Job } from '@/feature/jobs/types/job.types';
import { useTranslations } from '@/shared/hooks/useTranslations';
import JobCard from '@/shared/components/JobCard/JobCard';
import styles from './SimilarJobs.module.scss';

interface SimilarJobsProps {
  jobs: Job[];
  currentJobId: string;
  title?: string;
}

export default function SimilarJobs({ jobs, currentJobId, title }: SimilarJobsProps) {
  const t = useTranslations('jobDetail');
  const router = useRouter();

  if (jobs.length === 0) {
    return null;
  }

  const sectionTitle = title || t('lbl_similar_jobs');

  return (
    <div className="p-l" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 className={`mb-l ${styles.title}`}>{sectionTitle}</h2>
      <div className={styles.jobsList}>
        {jobs.map((job) => (
          <JobCard
            key={job.docId}
            job={job}
            onClick={() => {
              router.push(`/jobs/${job.docId}`);
            }}
            isHighlighted={
              job.featureExpireTimestamp
                ? new Date(job.featureExpireTimestamp) > new Date()
                : false
            }
          />
        ))}
      </div>
    </div>
  );
}

