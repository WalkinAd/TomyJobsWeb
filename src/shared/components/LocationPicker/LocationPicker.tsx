'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from '@/shared/hooks/useTranslations';
import { IoLocation, IoSearch } from 'react-icons/io5';
import { FaChevronDown } from 'react-icons/fa';
import styles from './LocationPicker.module.scss';

interface LocationPickerProps {
  locations: string[];
  selectedLocations: string[];
  onSelect: (locations: string[]) => void;
  placeholder?: string;
}

export default function LocationPicker({
  locations,
  selectedLocations,
  onSelect,
  placeholder,
}: LocationPickerProps) {
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

  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (location: string) => {
    const newSelection = selectedLocations.includes(location)
      ? selectedLocations.filter((loc) => loc !== location)
      : [...selectedLocations, location];
    onSelect(newSelection);
  };

  const handleClear = () => {
    onSelect([]);
    setSearchQuery('');
  };

  const displayText =
    selectedLocations.length === 0
      ? placeholder || t('lbl_select_location')
      : selectedLocations.length === 1
      ? selectedLocations[0]
      : `${selectedLocations.length} ${t('lbl_location')}`;

  return (
    <div className={styles.locationPicker} ref={dropdownRef}>
      <button
        type="button"
        className={`flex-row items-center ${styles.trigger}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <IoLocation size={20} className={styles.locationIcon} />
        <span className={styles.text}>{displayText}</span>
        <FaChevronDown size={16} className={styles.chevronIcon} />
      </button>

      {isOpen && (
        <div className={`flex-col ${styles.dropdown}`}>
          <div className={`flex-row items-center ${styles.searchContainer}`}>
            <IoSearch size={20} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t('lbl_search_by_location')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {selectedLocations.length > 0 && (
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
            {filteredLocations.length === 0 ? (
              <div className={styles.empty}>{t('lbl_no_jobs')}</div>
            ) : (
              filteredLocations.map((location) => (
                <label
                  key={location}
                  className={`flex-row items-center ${styles.item} ${
                    selectedLocations.includes(location) ? styles.selected : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(location)}
                    onChange={() => handleToggle(location)}
                    className={styles.checkbox}
                  />
                  <span className={styles.itemText}>{location}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

