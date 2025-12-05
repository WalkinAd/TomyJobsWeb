import { collection, getDocs } from "firebase/firestore";
import { db } from "@/shared/services/firebase";
import { Category, SubCategory } from "../types/category.types";

export const categoriesService = {
  async getAllCategories(): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, "categories");
      const snapshot = await getDocs(categoriesRef);

      if (snapshot.empty) {
        console.warn("no categories found in firestore");
        return [];
      }

      const categories: Category[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          docId: doc.id,
          name: data.name || "",
          icon: data.icon || "",
          coverImage: data.cover_image || "",
          parentId: data.parent_id || "",
          status: data.status || 0,
          updatedAt: data.updatedAt || "",
        };
      });

      const filteredCategories = categories.filter((cat) => cat.status === 1);
      console.log(
        `loaded ${filteredCategories.length} categories from ${categories.length} total`
      );
      return filteredCategories;
    } catch (error) {
      console.error("error fetching categories:", error);
      throw error;
    }
  },

  async getMainCategories(): Promise<Category[]> {
    const allCategories = await this.getAllCategories();
    return allCategories.filter((cat) => cat.parentId === "");
  },

  async getSubCategories(parentId: string): Promise<SubCategory[]> {
    const allCategories = await this.getAllCategories();
    return allCategories
      .filter((cat) => cat.parentId === parentId)
      .map((cat) => ({
        docId: cat.docId,
        name: cat.name,
        parentId: cat.parentId,
        status: cat.status,
      }));
  },
};
