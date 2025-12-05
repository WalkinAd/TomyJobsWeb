'use client';

import { useTranslations } from '@/shared/hooks/useTranslations';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiGoogleplay, SiAppstore } from 'react-icons/si';
import WavyLineIcon from '../../Icons/WavyLineIcon';
import styles from './AppPromoSection.module.scss';

export default function AppPromoSection() {
  const t = useTranslations('footer');

  /**
   * TODO: Agrega aqui los links de las redes sociales, o elimina los que no quieras mostrar.
   */
  const socialLinks = [
    { icon: FaFacebook, href: '#' },
    { icon: FaXTwitter, href: '#' },
    { icon: FaInstagram, href: '#' },
    { icon: FaYoutube, href: '#' },
    { icon: FaTiktok, href: '#' },
  ];

  return (
    <div className={styles.topSection}>
      <div className={styles.wavyLines}>
        <WavyLineIcon className={styles.wavyLine1} variant="top" />
        <WavyLineIcon className={styles.wavyLine2} variant="bottom" />
      </div>
      <div className={styles.container}>
        <div className={`flex-row items-center flex-wrap ${styles.appPromoContent}`}>
          <div className={styles.leftSection}>
            <h3 className={styles.downloadTitle}>{t('download_app')}</h3>
            <p className={styles.downloadDescription}>
              {t('download_description')}
            </p>
            <div className={`flex-row ${styles.downloadButtons}`}>
              <div className={`flex-col ${styles.downloadButton}`}>
                <span className={styles.downloadLabel}>
                  {t('available_google_play')}
                </span>
                <div className={`flex-row items-center gap-s ${styles.storeLogo}`}>
                  <SiGoogleplay size={20} className={styles.storeIcon} />
                  <span>Google Play</span>
                </div>
              </div>
              <div className={`flex-col ${styles.downloadButton}`}>
                <span className={styles.downloadLabel}>
                  {t('available_app_store')}
                </span>
                <div className={`flex-row items-center gap-s ${styles.storeLogo}`}>
                  <SiAppstore size={20} className={styles.storeIcon} />
                  <span>App Store</span>
                </div>
              </div>
            </div>
            <div className={`flex-row ${styles.socialLinks}`}>
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className={`flex-center ${styles.socialLink}`}
                    aria-label={Icon.name || 'Social icon'}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className={`flex-center ${styles.centerSection}`}>
            <div className={`flex-col items-center ${styles.qrCard}`}>
              <p className={styles.qrText}>{t('scan_qr')}</p>
              <div className={`flex-center ${styles.qrCode}`}>
                <span>QR Code</span>
              </div>
            </div>
          </div>

          <div className={`flex-center ${styles.rightSection}`}>
            <div className={`flex-center ${styles.phoneMockup}`}>
              <span>Phone Mockup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

