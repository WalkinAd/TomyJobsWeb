'use client';

import { useRef, useState, useEffect } from 'react';
import { Category } from '@/feature/jobs/types/category.types';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './CategorySlider.module.scss';

interface CategorySliderProps {
  categories: Category[];
  selectedCategoryId?: string;
  onCategorySelect?: (categoryId: string) => void;
}

export default function CategorySlider({
  categories,
  selectedCategoryId,
  onCategorySelect,
}: CategorySliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 300;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const newScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
    
    scrollContainerRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`flex-row items-center ${styles.sliderContainer}`}>
      {canScrollLeft && (
        <button
          className={`flex-center ${styles.navButton} ${styles.navButtonLeft}`}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <FaArrowLeft size={24} />
        </button>
      )}
      
      <div ref={scrollContainerRef} className={`flex-row ${styles.slider}`}>
        {categories.map((category) => (
          <button
            key={category.docId}
            className={`flex-col flex-center ${styles.categoryItem} ${
              selectedCategoryId === category.docId ? styles.active : ''
            }`}
            onClick={() => onCategorySelect?.(category.docId)}
          >
            {category.icon && (
              <img
                src={category.icon}
                alt={category.name}
                className={styles.icon}
              />
            )}
            <span className={styles.name}>{category.name}</span>
          </button>
        ))}
      </div>

      {canScrollRight && (
        <button
          className={`flex-center ${styles.navButton} ${styles.navButtonRight}`}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <FaArrowRight size={24} />
        </button>
      )}
    </div>
  );
}

