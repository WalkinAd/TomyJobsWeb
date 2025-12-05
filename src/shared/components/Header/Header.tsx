'use client';

import { useTranslations } from '@/shared/hooks/useTranslations';
import Button from '../Button/Button';
import styles from './Header.module.scss';

export default function Header() {
  const tNav = useTranslations('navigation');
  const tApp = useTranslations('app');

  return (
    <header className={styles.header}>
      <div className={`flex-between ${styles.container}`}>
        <h1 className={styles.logo}>{tApp('name')}</h1>
        <Button variant="primary">
          <span>{tNav('login')}</span>
        </Button>
      </div>
    </header>
  );
}