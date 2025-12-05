'use client';

import { useState } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import styles from './ImageCarousel.module.scss';

interface ImageCarouselProps {
  images: string[];
  title: string;
}

export default function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const defaultImage =
    'https://tse1.mm.bing.net/th?id=OIP.PPBMLiYljuluJZtFxAZwDQHaHa&pid=Api&rs=1&c=1&qlt=95&h=180';

  const displayImages = images.length > 0 ? images : [defaultImage];

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.carousel}>
      <div className={styles.imageContainer}>
        <img
          src={displayImages[currentIndex]}
          alt={title}
          className={styles.image}
        />
        {displayImages.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={goToPrevious}
              aria-label="imagen anterior"
            >
              <IoChevronBack size={24} />
            </button>
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={goToNext}
              aria-label="siguiente imagen"
            >
              <IoChevronForward size={24} />
            </button>
          </>
        )}
        <div className={styles.counter}>
          {currentIndex + 1} / {displayImages.length}
        </div>
      </div>
      {displayImages.length > 1 && (
        <div className={styles.dots}>
          {displayImages.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === currentIndex ? styles.active : ''
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

