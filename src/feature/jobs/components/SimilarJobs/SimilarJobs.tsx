'use client';

import { useRouter } from 'next/navigation';
import { Job } from '@/feature/jobs/types/job.types';
import { categoriesService } from '@/feature/jobs/services/categories.service';
import { generateJobUrl, slugify } from '@/feature/jobs/utils/job.utils';
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
            onClick={async () => {
              if (!job.locator) return;

              let categorySlug = 'general';
              let subCategorySlug: string | undefined = undefined;
              
              if (job.catId) {
                const allCategories = await categoriesService.getAllCategories();
                const category = allCategories.find((cat) => cat.docId === job.catId);
                if (category) {
                  categorySlug = slugify(category.name);
                }
                
                if (job.subCatId) {
                  const subCategory = allCategories.find((cat) => cat.docId === job.subCatId);
                  if (subCategory) {
                    subCategorySlug = slugify(subCategory.name);
                  }
                }
              }
              
              const url = generateJobUrl(categorySlug, job.title || '', job.locator, subCategorySlug);
              router.push(url);
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

