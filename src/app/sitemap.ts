import { MetadataRoute } from "next";
import { jobsService } from "@/feature/jobs/services/jobs.service";
import { categoriesService } from "@/feature/jobs/services/categories.service";
import { generateJobUrl, slugify } from "@/feature/jobs/utils/job.utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tomyjobs.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  try {
    const [jobs, categories] = await Promise.all([
      jobsService.getAllJobs(),
      categoriesService.getAllCategories(),
    ]);

    const getLastModified = (job: any): Date => {
      if (job.editedTimestamp) {
        if (typeof job.editedTimestamp === "string") {
          return new Date(job.editedTimestamp);
        }
        if (
          job.editedTimestamp &&
          typeof job.editedTimestamp === "object" &&
          "toDate" in job.editedTimestamp
        ) {
          return (job.editedTimestamp as any).toDate();
        }
      }
      if (job.timestamp) {
        if (typeof job.timestamp === "string") {
          return new Date(job.timestamp);
        }
        if (
          job.timestamp &&
          typeof job.timestamp === "object" &&
          "toDate" in job.timestamp
        ) {
          return (job.timestamp as any).toDate();
        }
      }
      return new Date();
    };

    const jobRoutes: MetadataRoute.Sitemap = jobs
      .filter((job) => {
        const expireDate = job.expireTimestamp
          ? new Date(job.expireTimestamp)
          : undefined;
        if (expireDate && expireDate < new Date()) {
          return false;
        }
        if (!job.locator) {
          return false;
        }
        return true;
      })
      .map((job) => {
        let categorySlug = "general";
        let subCategorySlug: string | undefined = undefined;

        if (job.catId) {
          const category = categories.find((cat) => cat.docId === job.catId);
          if (category) {
            categorySlug = slugify(category.name);
          }
        }

        if (job.subCatId) {
          const subCategory = categories.find(
            (cat) => cat.docId === job.subCatId
          );
          if (subCategory) {
            subCategorySlug = slugify(subCategory.name);
          }
        }

        const jobUrl = generateJobUrl(
          categorySlug,
          job.title || "",
          job.locator || "",
          subCategorySlug
        );
        const lastModified = getLastModified(job);

        return {
          url: `${baseUrl}${jobUrl}`,
          lastModified,
          changeFrequency: "weekly" as const,
          priority: job.featureExpireTimestamp ? 0.8 : 0.6,
        };
      })
      .filter((route) => !route.url.includes("/undefined"));

    const categoryRoutes: MetadataRoute.Sitemap = categories
      .filter((cat) => cat.parentId === "")
      .map((category) => ({
        url: `${baseUrl}/${slugify(category.name)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    return [...staticRoutes, ...categoryRoutes, ...jobRoutes];
  } catch (error) {
    return staticRoutes;
  }
}
