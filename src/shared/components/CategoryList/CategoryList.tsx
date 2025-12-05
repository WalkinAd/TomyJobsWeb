'use client';

import { Category } from '@/feature/jobs/types/category.types';
import styles from './CategoryList.module.scss';

interface CategoryListProps {
  categories: Category[];
  selectedCategoryId?: string;
  onCategorySelect?: (categoryId: string) => void;
}

export default function CategoryList({
  categories,
  selectedCategoryId,
  onCategorySelect,
}: CategoryListProps) {
  return (
    <div className={`flex-row gap-m py-m ${styles.categoryList}`}>
      {categories.map((category) => (
        <button
          key={category.docId}
          className={`flex-col items-center gap-s p-m ${styles.categoryItem} ${
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
  );
}

