'use client';

import { useTranslations } from '@/shared/hooks/useTranslations';
import { Category } from '@/feature/jobs/types/category.types';
import CategoryPicker from '@/shared/components/CategoryPicker/CategoryPicker';
import LocationPicker from '@/shared/components/LocationPicker/LocationPicker';
import { IoSearch } from 'react-icons/io5';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  categories?: Category[];
  locations?: string[];
  selectedCategoryIds?: string[];
  selectedLocations?: string[];
  onSearch?: (query: string) => void;
  onCategoryChange?: (categoryIds: string[]) => void;
  onLocationChange?: (locations: string[]) => void;
}

export default function SearchBar({
  categories = [],
  locations = [],
  selectedCategoryIds = [],
  selectedLocations = [],
  onSearch,
  onCategoryChange,
  onLocationChange,
}: SearchBarProps) {
  const t = useTranslations('home');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex-center ${styles.searchBar}`}>
      <div className={`flex-col gap-s ${styles.wrapper} lg:flex-row lg:items-center lg:gap-0`}>
        <div className={`flex-row items-center flex-nowrap ${styles.searchContainer}`}>
          <div className={`flex-row items-center ${styles.searchInput}`}>
            <IoSearch size={20} className={styles.searchIcon} />
            <input
              type="text"
              name="search"
              placeholder={t('lbl_search')}
              className={styles.input}
            />
          </div>

          {categories.length > 0 && (
              <div className={styles.filterDesktop}>
                <CategoryPicker
                  categories={categories}
                  selectedCategoryIds={selectedCategoryIds}
                  onSelect={onCategoryChange || (() => {})}
                />
              </div>
          )}

          {locations.length > 0 && (
              <div className={styles.filterDesktop}>
                <LocationPicker
                  locations={locations}
                  selectedLocations={selectedLocations}
                  onSelect={onLocationChange || (() => {})}
                />
              </div>
          )}

          <button type="submit" className={`${styles.searchButton} flex-row items-center`}>
            <IoSearch size={20} className={styles.searchButtonIcon} />
            <span>{t('lbl_search')}</span>
          </button>
        </div>

        {(categories.length > 0 || locations.length > 0) && (
          <div className={`flex-row items-center flex-wrap ${styles.filtersContainer}`}>
            {categories.length > 0 && (
              <CategoryPicker
                categories={categories}
                selectedCategoryIds={selectedCategoryIds}
                onSelect={onCategoryChange || (() => {})}
              />
            )}

            {locations.length > 0 && (
              <LocationPicker
                locations={locations}
                selectedLocations={selectedLocations}
                onSelect={onLocationChange || (() => {})}
              />
            )}
          </div>
        )}
      </div>
    </form>
  );
}

