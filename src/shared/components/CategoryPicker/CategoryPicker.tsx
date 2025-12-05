'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from '@/shared/hooks/useTranslations';
import { Category } from '@/feature/jobs/types/category.types';
import { IoGrid, IoChevronDown } from 'react-icons/io5';
import { IoSearch } from 'react-icons/io5';
import styles from './CategoryPicker.module.scss';

interface CategoryPickerProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onSelect: (categoryIds: string[]) => void;
  placeholder?: string;
}

export default function CategoryPicker({
  categories,
  selectedCategoryIds,
  onSelect,
  placeholder,
}: CategoryPickerProps) {
  const t = useTranslations('home');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (categoryId: string) => {
    const newSelection = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId];
    onSelect(newSelection);
  };

  const handleClear = () => {
    onSelect([]);
    setSearchQuery('');
  };

  const selectedCategories = categories.filter((cat) =>
    selectedCategoryIds.includes(cat.docId)
  );

  const displayText =
    selectedCategoryIds.length === 0
      ? placeholder || t('lbl_all_categories')
      : selectedCategoryIds.length === 1
      ? selectedCategories[0]?.name || ''
      : `${selectedCategoryIds.length} ${t('lbl_categories')}`;

  return (
    <div className={styles.categoryPicker} ref={dropdownRef}>
      <button
        type="button"
        className={`flex-row items-center ${styles.trigger}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <IoGrid size={20} className={styles.filterIcon} />
        <span className={styles.text}>{displayText}</span>
        <IoChevronDown size={16} className={styles.chevronIcon} />
      </button>

      {isOpen && (
        <div className={`flex-col ${styles.dropdown}`}>
          <div className={`flex-row items-center ${styles.searchContainer}`}>
            <IoSearch size={20} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t('lbl_search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {selectedCategoryIds.length > 0 && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
              >
                {t('common.clear')}
              </button>
            )}
          </div>

          <div className={styles.list}>
            {filteredCategories.length === 0 ? (
              <div className={styles.empty}>{t('lbl_no_jobs')}</div>
            ) : (
              filteredCategories.map((category) => (
                <label
                  key={category.docId}
                  className={`flex-row items-center ${styles.item} ${
                    selectedCategoryIds.includes(category.docId)
                      ? styles.selected
                      : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(category.docId)}
                    onChange={() => handleToggle(category.docId)}
                    className={styles.checkbox}
                  />
                  {category.icon && (
                    <img
                      src={category.icon}
                      alt={category.name}
                      className={styles.icon}
                    />
                  )}
                  <span className={styles.itemText}>{category.name}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

