'use client';

import { ReactNode } from 'react';
import { FaInbox } from 'react-icons/fa';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  text: string;
  icon?: ReactNode;
}

export default function EmptyState({ text, icon }: EmptyStateProps) {
  return (
    <div className={`flex-col items-center ${styles.emptyState}`}>
      <div className="flex-center">
        {icon || <FaInbox size={64} className={styles.icon} />}
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  );
}

