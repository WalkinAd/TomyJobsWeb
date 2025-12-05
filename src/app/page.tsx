'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/shared/hooks/useTranslations';
import { jobsService } from '@/feature/jobs/services/jobs.service';
import { categoriesService } from '@/feature/jobs/services/categories.service';
import { Job } from '@/feature/jobs/types/job.types';
import { Category } from '@/feature/jobs/types/category.types';
import { useJobFilters } from '@/feature/jobs/hooks/useJobFilters';
import Header from '@/shared/components/Header/Header';
import SearchBar from '@/shared/components/SearchBar/SearchBar';
import CategorySlider from '@/shared/components/CategorySlider/CategorySlider';
import JobCard from '@/shared/components/JobCard/JobCard';
import { HomePageSkeleton } from '@/shared/components/Skeleton/Skeleton';
import EmptyState from '@/shared/components/EmptyState/EmptyState';
import Footer from '@/shared/components/Footer/Footer';
import styles from './page.module.scss';

export default function Home() {
  const t = useTranslations('home');
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();

  const {
    filters,
    filteredJobs,
    updateSearchQuery,
    updateCategories,
    updateLocations,
  } = useJobFilters(jobs);

  const locations = useMemo(() => {
    const locationSet = new Set<string>();
    jobs.forEach((job) => {
      if (job.location) {
        locationSet.add(job.location);
      }
    });
    return Array.from(locationSet).sort();
  }, [jobs]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobsData, categoriesData] = await Promise.all([
        jobsService.getAllJobs(),
        categoriesService.getMainCategories(),
      ]);
      setJobs(jobsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const featuredJobs = filteredJobs
    .filter((job) => job.featureExpireTimestamp)
    .slice(0, 4);

  const regularJobs = filteredJobs.slice(0, 8);

  if (loading) {
    return (
      <>
        <Header />
        <HomePageSkeleton isVisible={loading} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={`${styles.contentWrapper} py-xl`}>
        <div className={styles.container}>
          <h1 className={styles.title}>{t('msg_find_your_dream2')}</h1>
          <SearchBar
            categories={categories}
            locations={locations} 
            selectedCategoryIds={filters.categoryIds || []}
            selectedLocations={filters.locations || []}
            onSearch={handleSearch}
            onCategoryChange={handleCategoryFilterChange}
            onLocationChange={handleLocationFilterChange}
          />

          {categories.length > 0 && (
            <div className={styles.categoriesSection}>
              <CategorySlider
                categories={categories}
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
                    onClick={() => {
                      router.push(`/jobs/${job.docId}`);
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
                    onClick={() => {
                      router.push(`/jobs/${job.docId}`);
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {filteredJobs.length === 0 && !loading && (
            <EmptyState text={t('lbl_no_jobs')} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
