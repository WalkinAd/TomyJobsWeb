'use client';

import { Job } from '@/feature/jobs/types/job.types';
import { generateJobUrl } from '@/feature/jobs/utils/job.utils';
import { useTranslations } from '@/shared/hooks/useTranslations';
import { useDisplayNameAndImage } from '@/shared/hooks/useDisplayNameAndImage';
import Button from '@/shared/components/Button/Button';
import { Skeleton } from '@/shared/components/Skeleton/Skeleton';
import { IoCheckmarkCircle, IoChatbubbleOutline, IoCallOutline, IoLink } from 'react-icons/io5';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './JobPublisherInfo.module.scss';

interface JobPublisherInfoProps {
  job: Job;
  categorySlug?: string;
  subCategorySlug?: string;
}

export default function JobPublisherInfo({ job, categorySlug = 'general', subCategorySlug }: JobPublisherInfoProps) {
  const t = useTranslations('jobDetail');
  const { name, imageUrl, isLoading, isVerified } = useDisplayNameAndImage({
    userId: job.userId,
    job,
  });

  const isPremium = job.featureExpireTimestamp
    ? new Date(job.featureExpireTimestamp) > new Date()
    : false;

  const getJobShareUrl = (): string => {
    if (!job.locator) {
      return window.location.origin;
    }

    const path = generateJobUrl(categorySlug, job.title || '', job.locator, subCategorySlug);
    const fullUrl = `${window.location.origin}${path}`;
    
    return fullUrl;
  };

  const getResponseTimeText = (responseTime?: string): string => {
    if (!responseTime) return '';
    const timeMap: Record<string, string> = {
      'within_hour': 'dentro de 1 hora',
      'within_day': 'dentro de 1 día',
      'within_week': 'dentro de 1 semana',
    };
    return timeMap[responseTime] || responseTime;
  };

  const handleCall = () => {
    if (job.mobileNumber) {
      window.location.href = `tel:${job.mobileNumber}`;
    }
  };

  const handleMessage = () => {
  };

  const handleReport = () => {
  };

  const handleShareWhatsApp = () => {
    const url = getJobShareUrl();
    const text = job.title || '';
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const handleCopyLink = () => {
    const url = getJobShareUrl();
    navigator.clipboard.writeText(url);
  };

  return (
    <div className={`flex-col gap-xl ${styles.sidebar}`}>
      <div className="flex-col gap-m">
        <h3 className={styles.sectionTitle}>{t('lbl_posted_by')}</h3>
        {isLoading ? (
          <div className={`flex-row items-start gap-m p-l ${styles.publisherCard}`}>
            <Skeleton className={styles.avatarSkeleton} />
            <div className="flex-col gap-xs flex-1">
              <Skeleton className={styles.nameSkeleton} />
              <Skeleton className={styles.metaSkeleton} />
            </div>
          </div>
        ) : (
          <div className={`flex-row items-start gap-m p-l ${styles.publisherCard} ${isPremium ? styles.premium : ''}`}>
            <div className={`relative flex-center ${styles.avatar}`}>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={name}
                  className={styles.avatarImage}
                />
              )}
              {isVerified && (
                <div className={`flex-center ${styles.verifiedBadge}`}>
                  <IoCheckmarkCircle size={16} />
                </div>
              )}
            </div>
            <div className="flex-col gap-xs" style={{ minWidth: 0 }}>
              <div className="flex-row items-center gap-xs">
                <span className={styles.name}>
                  {name || (job.createdByCompanyId ? t('lbl_company') : t('lbl_user'))}
                </span>
                {isVerified && (
                  <IoCheckmarkCircle
                    size={16}
                    className={styles.verifiedIcon}
                    title={t('lbl_verified')}
                  />
                )}
              </div>
              {(job.responseTime || (job.isNumberPublicly && job.mobileNumber)) && (
                <div className="flex-row items-center gap-xs flex-wrap">
                  {job.responseTime && (
                    <span className={styles.metaText}>{getResponseTimeText(job.responseTime)}</span>
                  )}
                  {job.isNumberPublicly && job.mobileNumber && (
                    <>
                      {job.responseTime && <span className={styles.separator}>•</span>}
                      <span className={styles.metaText}>{job.mobileNumber}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-col gap-s">
        {job.mobileNumber && (
          <Button variant="primary" onClick={handleCall}>
            <div className="flex-row items-center gap-xs">
              <IoCallOutline size={18} />
              <span>{t('lbl_call')}</span>
            </div>
          </Button>
        )}
        <Button variant="primary" onClick={handleMessage}>
          <div className="flex-row items-center gap-xs">
            <IoChatbubbleOutline size={18} />
            <span>{t('lbl_message')}</span>
          </div>
        </Button>
        <button className={styles.reportButton} onClick={handleReport}>
          {t('lbl_report')}
        </button>
      </div>

      <div className="flex-col gap-m">
        <h3 className={styles.sectionTitle}>{t('lbl_share_ad')}</h3>
        <div className="flex-row gap-s">
          <button
            className={`flex-center ${styles.shareButton}`}
            onClick={handleShareWhatsApp}
            data-tooltip={t('lbl_share_whatsapp')}
            aria-label={t('lbl_share_whatsapp')}
          >
            <FaWhatsapp size={20} />
          </button>
          <button
            className={`flex-center ${styles.shareButton}`}
            onClick={handleCopyLink}
            data-tooltip={t('lbl_copy_link')}
            aria-label={t('lbl_copy_link')}
          >
            <IoLink size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
