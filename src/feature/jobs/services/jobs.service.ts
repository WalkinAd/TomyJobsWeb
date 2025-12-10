import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/shared/services/firebase";
import { Job } from "../types/job.types";

export const jobsService = {
  async getAllJobs(): Promise<Job[]> {
    try {
      const jobsRef = collection(db, "Jobs");
      const snapshot = await getDocs(jobsRef);

      if (snapshot.empty) {
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

      return filteredJobs;
    } catch (error) {
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
      return [];
    }
  },

  async getJobById(jobId: string): Promise<Job | null> {
    try {
      const jobRef = doc(db, "Jobs", jobId);
      const snapshot = await getDoc(jobRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.data();
      return {
        docId: snapshot.id,
        jobId: snapshot.id,
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
    } catch (error) {
      return null;
    }
  },

  async getJobByLocator(locator: string): Promise<Job | null> {
    try {
      const jobsRef = collection(db, "Jobs");
      const q = query(jobsRef, where("locator", "==", locator));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
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
    } catch (error) {
      return null;
    }
  },

  async getSimilarJobs(
    subCatId: string,
    location: string,
    excludeJobId: string
  ): Promise<Job[]> {
    try {
      const jobsRef = collection(db, "Jobs");
      const q = query(
        jobsRef,
        where("subCat_id", "==", subCatId),
        where("location", "==", location)
      );
      const snapshot = await getDocs(q);

      const jobs: Job[] = snapshot.docs
        .filter((doc) => doc.id !== excludeJobId)
        .map((doc) => {
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

      return filteredJobs.slice(0, 10);
    } catch (error) {
      return [];
    }
  },

  async getJobsBySubCategory(
    subCatId: string,
    excludeJobId: string
  ): Promise<Job[]> {
    try {
      const jobsRef = collection(db, "Jobs");
      const q = query(jobsRef, where("subCat_id", "==", subCatId));
      const snapshot = await getDocs(q);

      const jobs: Job[] = snapshot.docs
        .filter((doc) => doc.id !== excludeJobId)
        .map((doc) => {
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

      return filteredJobs.slice(0, 10);
    } catch (error) {
      return [];
    }
  },
};
