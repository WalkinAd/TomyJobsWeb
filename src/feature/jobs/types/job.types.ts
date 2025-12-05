import { Timestamp } from 'firebase/firestore';

export interface Job {
  docId: string;
  jobId?: string;
  catId?: string;
  subCatId?: string;
  title?: string;
  description?: string;
  location?: string;
  mobileNumber?: string;
  hiringType?: string;
  status?: string;
  isNumberPublicly?: boolean;
  timestamp?: Timestamp;
  editedTimestamp?: Timestamp;
  expireTimestamp?: string;
  featureExpireTimestamp?: string;
  userId?: string;
  banner?: string[];
  favUserIds?: string[];
  viewerUserIds?: string[];
  responseTime?: string;
  isVerified: boolean;
  locator?: string;
  createdByUserId?: string;
  createdByCompanyId?: string;
}

export interface JobFilters {
  categoryId?: string;
  subCategoryId?: string;
  location?: string;
  hiringType?: string;
  searchQuery?: string;
}

