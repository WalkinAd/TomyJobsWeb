'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jobsService } from '@/feature/jobs/services/jobs.service';
import { categoriesService } from '@/feature/jobs/services/categories.service';
import { generateJobUrl, slugify } from '@/feature/jobs/utils/job.utils';
import { useDeepLink } from '@/shared/hooks/useDeepLink';
import { JobDetailSkeleton } from '@/shared/components/Skeleton/Skeleton';
import Footer from '@/shared/components/Footer/Footer';

export default function JobLegacyRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { shouldShowWeb } = useDeepLink({
    jobId: jobId || '',
  });

  useEffect(() => {
    if (jobId && shouldShowWeb) {
      redirectToNewFormat();
    }
  }, [jobId, shouldShowWeb]);

  const redirectToNewFormat = async () => {
    if (!jobId) return;

    try {
      const jobData = await jobsService.getJobById(jobId);
      
      if (!jobData) {
        router.push('/');
        return;
      }

      let categorySlug = 'general';
      if (jobData.catId) {
        const allCategories = await categoriesService.getAllCategories();
        const category = allCategories.find((cat) => cat.docId === jobData.catId);
        if (category) {
          categorySlug = slugify(category.name);
        }
      }

      const newUrl = generateJobUrl(categorySlug, jobData.title || '', jobData.docId);
      router.replace(newUrl);
    } catch (error) {
      router.push('/');
    }
  };

  return (
    <>
      <JobDetailSkeleton />
      <Footer showAppPromo={false} />
    </>
  );
}

