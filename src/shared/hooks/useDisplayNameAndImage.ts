"use client";

import { useEffect, useState } from "react";
import { usersService, UserData } from "@/shared/services/users.service";
import { companiesService } from "@/shared/services/companies.service";
import { Job } from "@/feature/jobs/types/job.types";
import { Timestamp } from "firebase/firestore";

interface DisplayInfo {
  name: string;
  imageUrl: string;
  isLoading: boolean;
  isVerified: boolean;
}

interface UseDisplayNameAndImageProps {
  userId?: string;
  job?: Job;
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
    console.log("useDisplayNameAndImage - iniciando effect", {
      userId,
      createdByCompanyId: job?.createdByCompanyId,
    });

    if (!userId) {
      console.log("useDisplayNameAndImage - no userId, retornando vacío");
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
        console.log(
          "useDisplayNameAndImage - cargando información del usuario"
        );
        const user = await usersService.getUserById(userId);

        if (!user) {
          console.log("useDisplayNameAndImage - usuario no encontrado");
          setDisplayInfo({
            name: "",
            imageUrl: "",
            isLoading: false,
            isVerified: false,
          });
          return;
        }

        console.log("useDisplayNameAndImage - usuario encontrado:", {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          activePlan: user.activePlan,
          senderNameProById: user.senderNameProById,
        });

        // primero verificar si el job tiene createdByCompanyId
        if (job?.createdByCompanyId) {
          console.log(
            "useDisplayNameAndImage - job tiene createdByCompanyId:",
            job.createdByCompanyId
          );
          const company = await companiesService.getCompanyById(
            job.createdByCompanyId
          );

          if (company && company.name) {
            console.log(
              "useDisplayNameAndImage - compañía encontrada por createdByCompanyId:",
              company
            );
            setDisplayInfo({
              name: company.name,
              imageUrl: company.imgLogo || company.imgCover || "",
              isLoading: false,
              isVerified: company.isVerified || false,
            });
            return;
          } else {
            console.log(
              "useDisplayNameAndImage - compañía no encontrada o sin nombre"
            );
          }
        }

        // verificar si tiene plan activo
        const hasActivePlan =
          user.activePlan != null &&
          user.activePlan.plan != null &&
          user.activePlan.expiredAt != null &&
          user.activePlan.expiredAt instanceof Timestamp &&
          user.activePlan.expiredAt.toDate() > new Date();

        console.log("useDisplayNameAndImage - hasActivePlan:", hasActivePlan);

        if (!hasActivePlan) {
          console.log(
            "useDisplayNameAndImage - no tiene plan activo, usando datos del usuario"
          );
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

        // si tiene plan activo, verificar senderNameProById
        if (hasActivePlan) {
          const senderNameProById = user.senderNameProById;
          console.log(
            "useDisplayNameAndImage - senderNameProById:",
            senderNameProById
          );

          if (senderNameProById && senderNameProById.trim() !== "") {
            if (senderNameProById === user.userId) {
              console.log(
                "useDisplayNameAndImage - senderNameProById es igual al userId, usando datos del usuario"
              );
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
              console.log(
                "useDisplayNameAndImage - buscando compañía por senderNameProById:",
                senderNameProById
              );
              const company = await companiesService.getCompanyById(
                senderNameProById
              );

              if (company && company.name) {
                console.log(
                  "useDisplayNameAndImage - compañía encontrada por senderNameProById:",
                  company
                );
                setDisplayInfo({
                  name: company.name,
                  imageUrl: company.imgLogo || company.imgCover || "",
                  isLoading: false,
                  isVerified: company.isVerified || false,
                });
                return;
              } else {
                console.log(
                  "useDisplayNameAndImage - compañía no encontrada por senderNameProById"
                );
              }
            }
          }
        }

        console.log(
          "useDisplayNameAndImage - usando fallback a datos del usuario"
        );
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
        console.error(
          "useDisplayNameAndImage - error loading display info:",
          error
        );
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
