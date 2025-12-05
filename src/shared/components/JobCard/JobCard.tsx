'use client';

import { Job } from '@/feature/jobs/types/job.types';
import { formatJobDate, getDaysLeft, getCountryFromLocation, getJobImageUrl } from '@/feature/jobs/utils/job.utils';
import { useTranslations } from '@/shared/hooks/useTranslations';
import { IoLocation } from 'react-icons/io5';
import { FaEye } from 'react-icons/fa';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import styles from './JobCard.module.scss';

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  isHighlighted?: boolean;
  isDisabled?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export default function JobCard({ 
  job, 
  onClick, 
  isHighlighted = false,
  isDisabled = false,
  isFavorite = false,
  onFavoriteToggle
}: JobCardProps) {
  const t = useTranslations('home');
  const imageUrl = getJobImageUrl(job.banner);
  const viewsCount = job.viewerUserIds?.length || 0;
  const daysLeft = getDaysLeft(job.expireTimestamp);
  const country = getCountryFromLocation(job.location);

  return (
    <div 
      className={`flex-col ${styles.jobCard} ${isHighlighted ? styles.highlighted : ''} ${isDisabled ? styles.disabled : ''}`}
      onClick={isDisabled ? undefined : onClick}
    >
      <div className={`${styles.imageWrapper} relative`}>
        <img
          src={imageUrl}
          alt={job.title || t('lbl_no_jobs')}
          className={styles.image}
        />
        
        {job.isVerified && (
          <span className={styles.verified}>{t('lbl_verified')}</span>
        )}

        <button 
          className={`flex-center ${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`} 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.();
          }}
        >
          {isFavorite ? (
            <FaHeart size={18} className={styles.favoriteIcon} />
          ) : (
            <FaRegHeart size={18} className={styles.favoriteIcon} />
          )}
        </button>

        {viewsCount > 0 && (
          <div className={`flex-row items-center gap-s ${styles.viewsBadge}`}>
            <FaEye size={12} />
            <span>{viewsCount}</span>
          </div>
        )}
      </div>

      <div className={`flex-col gap-s p-m ${styles.content}`}>
        <h3 className={styles.title} title={job.title}>
          {job.title}
        </h3>

        <div className="flex-row items-center gap-s">
          <IoLocation size={14} className={styles.locationIcon} />
          <span className={styles.location}>{job.location || ''}</span>
        </div>

        <div className="flex-row items-center justify-between gap-s">
          {job.hiringType && (
            <span className={`items-center ${styles.hiringType}`}>{job.hiringType}</span>
          )}
          {job.timestamp && (
            <span className={styles.date}>
              {daysLeft !== null ? (
                <span className={styles.daysLeft}>{daysLeft} {t('lbl_days')}</span>
              ) : (
                formatJobDate(job.timestamp)
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
