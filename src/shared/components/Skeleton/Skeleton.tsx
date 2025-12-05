'use client';

import { useEffect, useState } from 'react';
import styles from './Skeleton.module.scss';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`${styles.skeleton} ${className}`} />;
}

interface HomePageSkeletonProps {
  isVisible: boolean;
}

export function HomePageSkeleton({ isVisible }: HomePageSkeletonProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.homeSkeleton} py-xl ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={styles.container}>
        <div className="flex-center mb-lg">
          <Skeleton className={styles.titleSkeleton} />
        </div>

        <div className={`${styles.categoriesSkeleton} mb-xxl`}>
          <div className={`flex-row gap-l ${styles.categoryItems}`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`flex-col items-center gap-s ${styles.categoryItem}`}>
                <Skeleton className={styles.categoryIcon} />
                <Skeleton className={styles.categoryText} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.jobsSectionSkeleton}>
          <Skeleton className={`${styles.sectionTitle} mb-l`} />
          <div className={styles.jobsGrid}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flex-col ${styles.jobCardSkeleton}`}>
                <div className={`relative ${styles.jobImageWrapper}`}>
                  <Skeleton className={styles.jobImage} />
                </div>
                <div className={`flex-col gap-s p-m ${styles.jobContent}`}>
                  <Skeleton className={styles.jobTitle} />
                  <Skeleton className={styles.jobSubtitle} />
                  <div className="flex-between mt-auto">
                    <Skeleton className={styles.jobBadge} />
                    <Skeleton className={styles.jobDate} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.jobsSectionSkeleton}>
          <Skeleton className={`${styles.sectionTitle} mb-l`} />
          <div className={styles.jobsGrid}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`flex-col ${styles.jobCardSkeleton}`}>
                <div className={`relative ${styles.jobImageWrapper}`}>
                  <Skeleton className={styles.jobImage} />
                </div>
                <div className={`flex-col gap-s p-m ${styles.jobContent}`}>
                  <Skeleton className={styles.jobTitle} />
                  <Skeleton className={styles.jobSubtitle} />
                  <div className="flex-between mt-auto">
                    <Skeleton className={styles.jobBadge} />
                    <Skeleton className={styles.jobDate} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function JobDetailSkeleton() {
  return (
    <div className={styles.jobDetailSkeleton}>
      <div className={styles.jobDetailContainer}>
        <div className={`flex-row items-start ${styles.jobDetailLayout}`} style={{ gap: '12px' }}>
          <div className={styles.jobDetailLeftColumn}>
            <div className={`flex-row items-center gap-xs flex-wrap mb-m ${styles.breadcrumbsSkeleton}`}>
              <Skeleton className={styles.breadcrumbSkeleton} />
              <Skeleton className={styles.breadcrumbSkeleton} />
              <Skeleton className={styles.breadcrumbSkeleton} />
            </div>
            <Skeleton className={styles.imageSkeleton} />
            <div className={styles.contentSkeleton}>
              <Skeleton className={styles.titleSkeleton} />
              <Skeleton className={styles.metaSkeleton} />
              <Skeleton className={styles.descriptionSkeleton} />
              <Skeleton className={styles.detailsSkeleton} />
            </div>
          </div>
          <div className={styles.jobDetailRightColumn}>
            <Skeleton className={styles.publisherSkeleton} />
          </div>
        </div>
      </div>
    </div>
  );
}

