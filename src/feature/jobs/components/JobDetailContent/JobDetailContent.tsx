'use client';

import { useState } from 'react';
import { Job } from '@/feature/jobs/types/job.types';
import { useTranslations } from '@/shared/hooks/useTranslations';
import { formatJobDate } from '@/feature/jobs/utils/job.utils';
import { IoLocationOutline, IoEyeOutline, IoTimeOutline } from 'react-icons/io5';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import styles from './JobDetailContent.module.scss';
import Button from '@/shared/components/Button/Button';

interface JobDetailContentProps {
  job: Job;
}

export default function JobDetailContent({ job }: JobDetailContentProps) {
  const t = useTranslations('jobDetail');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const viewsCount = job.viewerUserIds?.length || 0;
  const isPremium = job.featureExpireTimestamp
    ? new Date(job.featureExpireTimestamp) > new Date()
    : false;

  const description = job.description || '';
  const shouldTruncate = description.length > 300;
  const displayDescription = showFullDescription
    ? description
    : shouldTruncate
    ? description.substring(0, 300) + '...'
    : description;

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={`p-l ${styles.content}`}>
      <div className="mb-l">
        {isPremium && (
          <div className={`mb-s ${styles.premiumBadge}`}>
            <span>{t('lbl_premium')}</span>
          </div>
        )}
        <div className="flex-between items-start gap-m">
          <h1 className={styles.title}>{job.title}</h1>
          <button
            className={`flex-center ${styles.favoriteButton} ${
              isFavorite ? styles.favoriteActive : ''
            }`}
            onClick={handleFavoriteToggle}
            aria-label={isFavorite ? 'quitar de favoritos' : 'agregar a favoritos'}
          >
            {isFavorite ? (
              <FaHeart size={20} />
            ) : (
              <FaRegHeart size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="flex-row flex-wrap gap-m mb-l pb-l" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        {job.location && (
          <div className="flex-row items-center gap-xs">
            <IoLocationOutline size={16} />
            <span>{job.location}</span>
          </div>
        )}
        {viewsCount > 0 && (
          <div className="flex-row items-center gap-xs">
            <IoEyeOutline size={16} />
            <span>
              {viewsCount} {t('lbl_views')}
            </span>
          </div>
        )}
        {job.timestamp && (
          <div className="flex-row items-center gap-xs">
            <IoTimeOutline size={16} />
            <span>{formatJobDate(job.timestamp)}</span>
          </div>
        )}
      </div>

      {job.hiringType && (
        <div className={`mb-l ${styles.hiringType}`}>
          <span>{job.hiringType}</span>
        </div>
      )}

      <div className="mb-xl">
        <h2 className={`mb-m ${styles.sectionTitle}`}>{t('lbl_description')}</h2>
        <div className={styles.description}>
          <p>{displayDescription}</p>
          {shouldTruncate && (
            <Button
              variant="primary"
           
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? t('lbl_show_less') : t('lbl_show_more')}
            </Button>
          )}
        </div>
      </div>

      <div className="flex-col gap-s">
        {job.location && (
          <div className="flex-row items-start gap-s">
            <span className={styles.detailLabel}>{t('lbl_location')}:</span>
            <span>{job.location}</span>
          </div>
        )}
        {viewsCount > 0 && (
          <div className="flex-row items-start gap-s">
            <span className={styles.detailLabel}>{t('lbl_viewed_by')}:</span>
            <span>
              {viewsCount} {t('lbl_people')}
            </span>
          </div>
        )}
        {job.timestamp && (
          <div className="flex-row items-start gap-s">
            <span className={styles.detailLabel}>{t('lbl_created_at')}:</span>
            <span>{formatJobDate(job.timestamp)}</span>
          </div>
        )}
        {job.locator && (
          <div className="flex-row items-start gap-s">
            <span className={styles.detailLabel}>{t('lbl_locator')}:</span>
            <span>{job.locator}</span>
          </div>
        )}
        {job.editedTimestamp && (
          <div className="flex-row items-start gap-s">
            <span className={styles.detailLabel}>{t('lbl_edited_at')}:</span>
            <span>{formatJobDate(job.editedTimestamp)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

