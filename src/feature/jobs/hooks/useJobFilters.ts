import { useState, useMemo } from "react";
import { SerializedJob } from "../utils/job.serialization";

export interface JobFilters {
  searchQuery?: string;
  categoryIds?: string[];
  locations?: string[];
}

function matchesSearchQuery(job: SerializedJob, searchQuery?: string): boolean {
  if (!searchQuery || searchQuery.trim() === "") {
    return true;
  }

  const query = searchQuery.toLowerCase();
  const title = job.title?.toLowerCase() || "";
  const description = job.description?.toLowerCase() || "";

  return title.includes(query) || description.includes(query);
}

function matchesCategories(job: SerializedJob, categoryIds?: string[]): boolean {
  if (!categoryIds || categoryIds.length === 0) {
    return true;
  }

  return job.catId ? categoryIds.includes(job.catId) : false;
}

function matchesLocations(job: SerializedJob, locations?: string[]): boolean {
  if (!locations || locations.length === 0) {
    return true;
  }

  if (!job.location) {
    return false;
  }

  const jobLocation = job.location.toLowerCase();

  return locations.some((selectedLocation) =>
    jobLocation.includes(selectedLocation.toLowerCase())
  );
}

function matchesFilters(job: SerializedJob, filters: JobFilters): boolean {
  return (
    matchesSearchQuery(job, filters.searchQuery) &&
    matchesCategories(job, filters.categoryIds) &&
    matchesLocations(job, filters.locations)
  );
}

export function useJobFilters(jobs: SerializedJob[]) {
  const [filters, setFilters] = useState<JobFilters>({});

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => matchesFilters(job, filters));
  }, [jobs, filters]);

  const updateSearchQuery = (query: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: query.trim() || undefined,
    }));
  };

  const updateCategories = (categoryIds: string[]) => {
    setFilters((prev) => ({
      ...prev,
      categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
    }));
  };

  const updateLocations = (locations: string[]) => {
    setFilters((prev) => ({
      ...prev,
      locations: locations.length > 0 ? locations : undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    filters,
    filteredJobs,
    updateSearchQuery,
    updateCategories,
    updateLocations,
    clearFilters,
  };
}
