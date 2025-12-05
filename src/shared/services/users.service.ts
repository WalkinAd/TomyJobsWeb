import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface UserDataPlan {
  plan: string;
  purchasedAt: Timestamp;
  expiredAt: Timestamp;
}

export interface UserData {
  userId?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  activePlan?: UserDataPlan;
  senderNameProById?: string;
  isVerified?: boolean;
}

export const usersService = {
  async getUserById(userId: string): Promise<UserData | null> {
    try {
      console.log("usersService.getUserById - iniciando, userId:", userId);
      const userRef = doc(db, "users", userId);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        console.log("usersService.getUserById - usuario no existe");
        return null;
      }

      const data = snapshot.data();
      console.log("usersService.getUserById - datos del usuario:", {
        userId: snapshot.id,
        firstName: data.firstName,
        lastName: data.lastName,
        activePlan: data.activePlan,
        senderNameProById: data.senderNameProById,
        isVerified: data.isVerified,
      });

      const activePlan = data.activePlan
        ? {
            plan: data.activePlan.plan || "",
            purchasedAt: data.activePlan.purchasedAt || null,
            expiredAt: data.activePlan.expiredAt || null,
          }
        : undefined;

      const result = {
        userId: snapshot.id,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        profileImage: data.profileImage || "",
        activePlan,
        senderNameProById: data.senderNameProById || "",
        isVerified: data.isVerified || false,
      };

      console.log("usersService.getUserById - resultado procesado:", result);
      return result;
    } catch (error) {
      console.error(`error fetching user ${userId}:`, error);
      return null;
    }
  },
};
