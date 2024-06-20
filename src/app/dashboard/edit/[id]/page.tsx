import { JobPostingToolbar } from "@/components/job-posting-toolbar";
import { JobPostingForm } from "@/components/job-postings-form";
import {
  getMyJobPostingById,
  updateJobPosting,
} from "@/server/api/job-postings";
import { validateRequest } from "@/server/auth";
import { notFound } from "next/navigation";

export default async function EditJobPostingPage({
  params,
}: {
  params: { id: string };
}) {
  const auth = await validateRequest();
  if (!auth.user) return notFound();
  const jobPosting = await getMyJobPostingById(params.id);
  if (!jobPosting) return notFound();
  const action = updateJobPosting.bind(null, params.id);
  return (
    <div className="space-y-2">
      <h1 className="text-center text-2xl font-bold text-white">
        Update job posting{" "}
      </h1>
      <p className="text-center text-lg">
        After you update the job posting, we will pull this post back for
        review.
      </p>
      <JobPostingToolbar
        title={jobPosting.title}
        id={jobPosting.id}
        isArchived={jobPosting.isArchived}
      />
      <JobPostingForm action={action} data={jobPosting} />
    </div>
  );
}
