'use client';

import { useEffect, useState } from 'react';
import styles from './Loading.module.scss';

interface LoadingProps {
  text?: string;
  isVisible: boolean;
}

export default function Loading({ text = 'Loading', isVisible }: LoadingProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Duración de la animación fade-out
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div className={`flex-center ${styles.overlay} ${isVisible ? styles.fadeIn : styles.fadeOut}`}>
      <div className={`flex-col items-center ${styles.content}`}>
        <div className={styles.spinner}>
          <div className={styles.spinnerTrack}></div>
          <div className={styles.spinnerCircle}></div>
        </div>
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
}

