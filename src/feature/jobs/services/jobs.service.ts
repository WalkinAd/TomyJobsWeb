import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/shared/services/firebase";
import { Job } from "../types/job.types";

export const jobsService = {
  async getAllJobs(): Promise<Job[]> {
    try {
      const jobsRef = collection(db, "Jobs");
      const snapshot = await getDocs(jobsRef);

      if (snapshot.empty) {
        console.warn("no jobs found in firestore");
        return [];
      }

      const jobs: Job[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          docId: doc.id,
          jobId: doc.id,
          catId: data.cat_id || "",
          subCatId: data.subCat_id || "",
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          mobileNumber: data.mobileNumber || "",
          hiringType: data.hiringType || "",
          status: data.status || "",
          isNumberPublicly: data.isNumberPublicly || false,
          timestamp: data.timestamp || null,
          editedTimestamp: data.editedTimestamp || null,
          expireTimestamp: data.expireTimestamp || null,
          featureExpireTimestamp: data.featureExpireTimestamp || null,
          userId: data.userId || "",
          banner: data.banner || [],
          favUserIds: data.favUserIds || [],
          viewerUserIds: data.viewerUserIds || [],
          responseTime: data.responseTime || "",
          isVerified: data.isVerified || false,
          locator: data.locator || "",
          createdByUserId: data.createdByUserId || null,
          createdByCompanyId: data.createdByCompanyId || null,
        };
      });

      const filteredJobs = jobs.filter((job) => {
        if (!job.expireTimestamp) return false;
        const expireDate = new Date(job.expireTimestamp);
        if (expireDate < new Date()) return false;
        if (job.status?.toLowerCase().includes("pen")) return false;
        if (job.status?.toLowerCase().includes("rej")) return false;
        return true;
      });

      console.log(
        `loaded ${filteredJobs.length} jobs from ${jobs.length} total`
      );
      return filteredJobs;
    } catch (error) {
      console.error("error fetching jobs:", error);
      throw error;
    }
  },

  async getJobsByCategory(categoryId: string): Promise<Job[]> {
    try {
      const jobsRef = collection(db, "Jobs");
      const q = query(jobsRef, where("cat_id", "==", categoryId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          docId: doc.id,
          jobId: doc.id,
          ...data,
          isVerified: data.isVerified || false,
        } as Job;
      });
    } catch (error) {
      console.error("error fetching jobs by category:", error);
      return [];
    }
  },
};
