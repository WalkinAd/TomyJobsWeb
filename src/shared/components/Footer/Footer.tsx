'use client';

import AppPromoSection from './AppPromoSection/AppPromoSection';
import NavigationSection from './NavigationSection/NavigationSection';
 
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <AppPromoSection />
      <NavigationSection />
    </footer>
  );
}
