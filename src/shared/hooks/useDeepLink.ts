"use client";

import { useEffect, useState } from "react";

interface UseDeepLinkOptions {
  jobId: string;
  url?: string;
  delay?: number;
  enabled?: boolean;
}

export function useDeepLink({
  jobId,
  url,
  delay = 2500,
  enabled = true,
}: UseDeepLinkOptions) {
  const [shouldShowWeb, setShouldShowWeb] = useState(false);

  useEffect(() => {
    if (!jobId || !enabled) {
      setShouldShowWeb(true);
      return;
    }

    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileRegex =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileDevice = mobileRegex.test(userAgent.toLowerCase());

    if (isMobileDevice) {
      const startTime = Date.now();
      let appOpened = false;
      let attemptCount = 0;

      const tryOpenApp = (deepLinkUrl: string) => {
        attemptCount++;
        window.location.href = deepLinkUrl;

        const checkIfAppOpened = () => {
          const elapsed = Date.now() - startTime;

          if (elapsed < delay) {
            setTimeout(checkIfAppOpened, 100);
          } else {
            if (!appOpened) {
              if (attemptCount === 1 && url) {
                tryOpenApp(`https://tomyjobs.com/job/${jobId}`);
              } else {
                setShouldShowWeb(true);
              }
            }
          }
        };

        setTimeout(checkIfAppOpened, 100);

        const handleVisibilityChange = () => {
          if (document.hidden) {
            appOpened = true;
          }
        };

        const handleBlur = () => {
          appOpened = true;
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);

        setTimeout(() => {
          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange
          );
          window.removeEventListener("blur", handleBlur);
        }, delay);
      };

      if (url) {
        tryOpenApp(url);
      } else {
        tryOpenApp(`tomyjobs://job/${jobId}`);
      }
    } else {
      setShouldShowWeb(true);
    }
  }, [jobId, url, delay, enabled]);

  return { shouldShowWeb };
}
