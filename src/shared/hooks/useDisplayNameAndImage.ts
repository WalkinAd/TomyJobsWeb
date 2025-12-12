"use client";

import { useEffect, useState } from "react";
import { usersService, UserData } from "@/shared/services/users.service";
import { companiesService } from "@/shared/services/companies.service";
import type { SerializedJob } from "@/feature/jobs/utils/job.serialization";
import { Timestamp } from "firebase/firestore";

interface DisplayInfo {
  name: string;
  imageUrl: string;
  isLoading: boolean;
  isVerified: boolean;
}

interface UseDisplayNameAndImageProps {
  userId?: string;
  job?: SerializedJob;
}

export function useDisplayNameAndImage({
  userId,
  job,
}: UseDisplayNameAndImageProps): DisplayInfo {
  const [displayInfo, setDisplayInfo] = useState<DisplayInfo>({
    name: "",
    imageUrl: "",
    isLoading: true,
    isVerified: false,
  });

  useEffect(() => {
    if (!userId) {
      setDisplayInfo({
        name: "",
        imageUrl: "",
        isLoading: false,
        isVerified: false,
      });
      return;
    }

    const loadDisplayInfo = async () => {
      try {
        const user = await usersService.getUserById(userId);

        if (!user) {
          setDisplayInfo({
            name: "",
            imageUrl: "",
            isLoading: false,
            isVerified: false,
          });
          return;
        }

        if (job?.createdByCompanyId) {
          const company = await companiesService.getCompanyById(
            job.createdByCompanyId
          );

          if (company && company.name) {
            setDisplayInfo({
              name: company.name,
              imageUrl: company.imgLogo || company.imgCover || "",
              isLoading: false,
              isVerified: company.isVerified || false,
            });
            return;
          }
        }

        const hasActivePlan =
          user.activePlan != null &&
          user.activePlan.plan != null &&
          user.activePlan.expiredAt != null &&
          user.activePlan.expiredAt instanceof Timestamp &&
          user.activePlan.expiredAt.toDate() > new Date();

        if (!hasActivePlan) {
          const fullName = `${user.firstName || ""} ${
            user.lastName || ""
          }`.trim();
          setDisplayInfo({
            name: fullName || "Usuario",
            imageUrl: user.profileImage || "",
            isLoading: false,
            isVerified: user.isVerified || false,
          });
          return;
        }

        if (hasActivePlan) {
          const senderNameProById = user.senderNameProById;

          if (senderNameProById && senderNameProById.trim() !== "") {
            if (senderNameProById === user.userId) {
              const fullName = `${user.firstName || ""} ${
                user.lastName || ""
              }`.trim();
              setDisplayInfo({
                name: fullName || "Usuario",
                imageUrl: user.profileImage || "",
                isLoading: false,
                isVerified: user.isVerified || false,
              });
              return;
            } else {
              const company = await companiesService.getCompanyById(
                senderNameProById
              );

              if (company && company.name) {
                setDisplayInfo({
                  name: company.name,
                  imageUrl: company.imgLogo || company.imgCover || "",
                  isLoading: false,
                  isVerified: company.isVerified || false,
                });
                return;
              }
            }
          }
        }

        const fullName = `${user.firstName || ""} ${
          user.lastName || ""
        }`.trim();
        setDisplayInfo({
          name: fullName || "Usuario",
          imageUrl: user.profileImage || "",
          isLoading: false,
          isVerified: user.isVerified || false,
        });
      } catch (error) {
        setDisplayInfo({
          name: "",
          imageUrl: "",
          isLoading: false,
          isVerified: false,
        });
      }
    };

    loadDisplayInfo();
  }, [userId, job?.createdByCompanyId]);

  return displayInfo;
}
