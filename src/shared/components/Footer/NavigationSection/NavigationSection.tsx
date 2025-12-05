'use client';

import { useTranslations } from '@/shared/hooks/useTranslations';
import styles from './NavigationSection.module.scss';

export default function NavigationSection() {
  const t = useTranslations('footer');
  const tApp = useTranslations('app');

  return (
    <div className={styles.navigationSection}>
      <div className={styles.container}>
        <div className={`flex-row items-start flex-wrap ${styles.navContent}`}>
          <div className={styles.logoColumn}>
            <h2 className={styles.logo}>{tApp('name')}</h2>
          </div>

          <div className={`flex-row ${styles.rightColumns}`}>
            <div className={styles.navColumn}>
              <h4 className={styles.navTitle}>{t('need_help')}</h4>
              <ul className={`flex-col ${styles.navList}`}>
                <li>
                  <a href="#" className={styles.navLink}>{t('contact')}</a>
                </li>
                <li>
                  <a href="#" className={styles.navLink}>{t('terms')}</a>
                </li>
                <li>
                  <a href="#" className={styles.navLink}>{t('privacy')}</a>
                </li>
                <li>
                  <a href="#" className={styles.navLink}>{t('cookies')}</a>
                </li>
                <li>
                  <a href="#" className={styles.navLink}>
                    {t('manage_cookies')}
                  </a>
                </li>
                <li>
                  <a href="#" className={styles.navLink}>{t('security')}</a>
                </li>
              </ul>
            </div>

            <div className={styles.navColumn}>
              <h4 className={styles.navTitle}>{t('about')}</h4>
              <ul className={`flex-col ${styles.navList}`}>
                <li>
                  <a href="#" className={styles.navLink}>{tApp('name')} Express</a>
                </li>
                <li>
                  <a href="#" className={styles.navLink}>{t('blog')}</a>
                </li>
                <li>
                  <a href="#" className={styles.navLink}>{t('press')}</a>
                </li>
                <li>
                  <a href="#" className={styles.navLink}>
                    {t('work_with_us')}
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.navColumn}>
              <h4 className={styles.navTitle}>{t('for_professionals')}</h4>
              <ul className={`flex-col ${styles.navList}`}>
                <li>
                  <a href="#" className={styles.navLink}>{t('pro')}</a>
                </li>
                <li>
                  <a href="#" className={styles.navLink}>
                    {t('login_account')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

