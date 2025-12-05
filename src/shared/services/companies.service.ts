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
      console.log(
        "companiesService.getCompanyById - iniciando, companyId:",
        companyId
      );
      const companyRef = doc(db, "Companyprofile", companyId);
      const snapshot = await getDoc(companyRef);

      if (!snapshot.exists()) {
        console.log("companiesService.getCompanyById - compañía no existe");
        return null;
      }

      const data = snapshot.data();
      console.log(
        "companiesService.getCompanyById - datos de la compañía raw:",
        data
      );
      console.log("companiesService.getCompanyById - ImgIcons:", data.ImgIcons);
      console.log(
        "companiesService.getCompanyById - ImgIcons.ImgLogo:",
        data.ImgIcons?.ImgLogo
      );

      const imgLogo =
        data.ImgIcons?.ImgLogo || data.ImgLogo || data.imgLogo || "";
      const imgCover = data.ImgCover || data.imgCover || "";
      const name = data.Name || data.name || "";
      const isVerified = data.IsVerified || data.isVerified || false;

      console.log("companiesService.getCompanyById - datos procesados:", {
        id: snapshot.id,
        name,
        imgLogo,
        imgCover,
        isVerified,
      });

      const result = {
        id: snapshot.id,
        name,
        imgLogo,
        imgCover,
        isVerified,
      };

      console.log("companiesService.getCompanyById - resultado final:", result);
      return result;
    } catch (error) {
      console.error(`error fetching company ${companyId}:`, error);
      return null;
    }
  },
};
