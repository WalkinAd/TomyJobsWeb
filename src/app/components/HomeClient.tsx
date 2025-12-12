'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/hooks/useTranslations';
import { jobsService } from '@/feature/jobs/services/jobs.service';
import { categoriesService } from '@/feature/jobs/services/categories.service';
import { Category } from '@/feature/jobs/types/category.types';
import { useJobFilters } from '@/feature/jobs/hooks/useJobFilters';
import { generateJobUrl, slugify } from '@/feature/jobs/utils/job.utils';
import type { SerializedJob } from '@/feature/jobs/utils/job.serialization';
import SearchBar from '@/shared/components/SearchBar/SearchBar';
import CategorySlider from '@/shared/components/CategorySlider/CategorySlider';
import JobCard from '@/shared/components/JobCard/JobCard';
import EmptyState from '@/shared/components/EmptyState/EmptyState';
import styles from '../page.module.scss';

interface HomeClientProps {
  initialJobs: SerializedJob[];
  initialCategories: Category[];
}

export default function HomeClient({ initialJobs, initialCategories }: HomeClientProps) {
  const t = useTranslations('home');
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();

  const {
    filters,
    filteredJobs,
    updateSearchQuery,
    updateCategories,
    updateLocations,
  } = useJobFilters(initialJobs);

  const locations = useMemo(() => {
    const locationSet = new Set<string>();
    initialJobs.forEach((job) => {
      if (job.location) {
        locationSet.add(job.location);
      }
    });
    return Array.from(locationSet).sort();
  }, [initialJobs]);

  const handleSearch = (query: string) => {
    updateSearchQuery(query);
  };

  const handleCategorySelect = (categoryId: string) => {
    const newSelection =
      categoryId === selectedCategoryId ? [] : [categoryId];
    setSelectedCategoryId(newSelection[0]);
    updateCategories(newSelection);
  };

  const handleCategoryFilterChange = (categoryIds: string[]) => {
    updateCategories(categoryIds);
    setSelectedCategoryId(categoryIds[0]);
  };

  const handleLocationFilterChange = (locationList: string[]) => {
    updateLocations(locationList);
  };

  const getJobUrl = async (job: SerializedJob): Promise<string> => {
    if (!job.locator) {
      return '/';
    }

    let categorySlug = 'general';
    let subCategorySlug: string | undefined = undefined;
    
    if (job.catId) {
      const category = initialCategories.find((cat) => cat.docId === job.catId);
      if (category) {
        categorySlug = slugify(category.name);
      }
    }
    
    if (job.subCatId) {
      const allCategories = await categoriesService.getAllCategories();
      const subCategory = allCategories.find((cat) => cat.docId === job.subCatId);
      if (subCategory) {
        subCategorySlug = slugify(subCategory.name);
      }
    }
    
    return generateJobUrl(categorySlug, job.title || '', job.locator, subCategorySlug);
  };

  const featuredJobs = filteredJobs
    .filter((job) => job.featureExpireTimestamp)
    .slice(0, 4);

  const regularJobs = filteredJobs.slice(0, 8);

  return (
    <div className={`${styles.contentWrapper} py-xl`}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('msg_find_your_dream2')}</h1>
        <SearchBar
          categories={initialCategories}
          locations={locations} 
          selectedCategoryIds={filters.categoryIds || []}
          selectedLocations={filters.locations || []}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryFilterChange}
          onLocationChange={handleLocationFilterChange}
        />

        {initialCategories.length > 0 && (
          <div className={styles.categoriesSection}>
            <CategorySlider
              categories={initialCategories}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        )}

        {featuredJobs.length > 0 && (
          <section className={styles.jobsSection}>
            <div className="flex-between mb-l">
              <h2 className={styles.sectionTitle}>{t('lbl_top_jobs')}</h2>
            </div>
            <div className={styles.jobsGrid}>
              {featuredJobs.map((job) => (
                <JobCard
                  key={job.docId}
                  job={job}
                  onClick={async () => {
                    const url = await getJobUrl(job);
                    router.push(url);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {regularJobs.length > 0 && (
          <section className={styles.jobsSection}>
            <div className="flex-between mb-l">
              <h2 className={styles.sectionTitle}>{t('lbl_recent_jobs')}</h2>
            </div>
            <div className={styles.jobsGrid}>
              {regularJobs.map((job) => (
                <JobCard
                  key={job.docId}
                  job={job}
                  onClick={async () => {
                    const url = await getJobUrl(job);
                    router.push(url);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {filteredJobs.length === 0 && (
          <EmptyState text={t('lbl_no_jobs')} />
        )}
      </div>
    </div>
  );
}

