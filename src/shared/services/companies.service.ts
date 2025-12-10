import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface CompanyData {
  id?: string;
  name?: string;
  imgLogo?: string;
  imgCover?: string;
  isVerified?: boolean;
}

export const companiesService = {
  async getCompanyById(companyId: string): Promise<CompanyData | null> {
    try {
      const companyRef = doc(db, "Companyprofile", companyId);
      const snapshot = await getDoc(companyRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.data();

      const imgLogo =
        data.ImgIcons?.ImgLogo || data.ImgLogo || data.imgLogo || "";
      const imgCover = data.ImgCover || data.imgCover || "";
      const name = data.Name || data.name || "";
      const isVerified = data.IsVerified || data.isVerified || false;

      const result = {
        id: snapshot.id,
        name,
        imgLogo,
        imgCover,
        isVerified,
      };

      return result;
    } catch (error) {
      return null;
    }
  },
};
