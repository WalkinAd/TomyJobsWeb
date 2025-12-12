import { Job } from "../types/job.types";

export type SerializedJob = Omit<Job, "timestamp" | "editedTimestamp"> & {
  timestamp?: string | null;
  editedTimestamp?: string | null;
};

export function serializeJob(job: Job): SerializedJob {
  return {
    ...job,
    timestamp: job.timestamp
      ? typeof job.timestamp === "object" && "toDate" in job.timestamp
        ? (job.timestamp as any).toDate().toISOString()
        : typeof job.timestamp === "string"
        ? job.timestamp
        : null
      : null,
    editedTimestamp: job.editedTimestamp
      ? typeof job.editedTimestamp === "object" &&
        "toDate" in job.editedTimestamp
        ? (job.editedTimestamp as any).toDate().toISOString()
        : typeof job.editedTimestamp === "string"
        ? job.editedTimestamp
        : null
      : null,
  };
}

export function serializeJobs(jobs: Job[]): SerializedJob[] {
  return jobs.map(serializeJob);
}
