'use client';

import { useEffect, useState } from 'react';
import { Job } from '@/feature/jobs/types/job.types';
import { useTranslations } from '@/shared/hooks/useTranslations';
import { useDisplayNameAndImage } from '@/shared/hooks/useDisplayNameAndImage';
import Button from '@/shared/components/Button/Button';
import { IoChatbubbleOutline, IoCallOutline } from 'react-icons/io5';
import { getJobImageUrl } from '@/feature/jobs/utils/job.utils';
import styles from './JobDetailHeader.module.scss';

interface JobDetailHeaderProps {
  job: Job;
}

export default function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const t = useTranslations('jobDetail');
  const [isSticky, setIsSticky] = useState(false);
  const imageUrl = getJobImageUrl(job.banner);
  const { name } = useDisplayNameAndImage({ userId: job.userId, job });

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCall = () => {
    if (job.mobileNumber) {
      window.location.href = `tel:${job.mobileNumber}`;
    }
  };

  const handleMessage = () => {
  };

  return (
    <div className={`${styles.stickyHeader} ${isSticky ? styles.visible : styles.hidden}`}>
      <div className="flex-row items-center gap-m px-l" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <img
          src={imageUrl}
          alt={job.title || ''}
          className={styles.thumbnail}
        />
        <div className="flex-col flex-1" style={{ minWidth: 0 }}>
          <h2 className={styles.title}>{job.title}</h2>
          {name && <p className={styles.publisherName}>{name}</p>}
        </div>
        <div className="flex-row items-center gap-s">
          <Button variant="primary" onClick={handleMessage}>
            <div className="flex-row items-center gap-xs">
              <IoChatbubbleOutline size={18} />
              <span>{t('lbl_message')}</span>
            </div>
          </Button>
          {job.mobileNumber && (
            <Button variant="primary" onClick={handleCall}>
              <div className="flex-row items-center gap-xs">
                <IoCallOutline size={18} />
                <span>{t('lbl_call')}</span>
              </div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

