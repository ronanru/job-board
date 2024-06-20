import { JobPostingForm } from "@/components/job-postings-form";
import { createJobPosting } from "@/server/api/job-postings";
import { validateRequest } from "@/server/auth";
import { notFound } from "next/navigation";

export default async function NewJobPosting() {
  const auth = await validateRequest();
  if (!auth.user) return notFound();
  return (
    <div className="space-y-2">
      <h1 className="text-center text-2xl font-bold text-white">
        Create a new job posting
      </h1>
      <p className="text-center text-lg">
        Your post will not be visible right away, we will review it first.
      </p>
      <JobPostingForm action={createJobPosting} />
    </div>
  );
}
