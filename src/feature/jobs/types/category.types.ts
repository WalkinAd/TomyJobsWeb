export interface Category {
  docId: string;
  name: string;
  icon: string;
  coverImage: string;
  parentId: string;
  status: number;
  updatedAt: string;
}

export interface SubCategory {
  docId: string;
  name: string;
  parentId: string;
  status: number;
}

