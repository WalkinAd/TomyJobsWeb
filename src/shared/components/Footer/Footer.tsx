'use client';

import AppPromoSection from './AppPromoSection/AppPromoSection';
import NavigationSection from './NavigationSection/NavigationSection';
 
import styles from './Footer.module.scss';

interface FooterProps {
  showAppPromo?: boolean;
}

export default function Footer({ showAppPromo = true }: FooterProps) {
  return (
    <footer className={styles.footer}>
      {showAppPromo && <AppPromoSection />}
      <NavigationSection />
    </footer>
  );
}
