import { JobPostingCard } from "@/components/job-posting-card";
import { getAllJobPostings } from "@/server/api/job-postings";
import { validateRequest } from "@/server/auth";
import { notFound } from "next/navigation";

export default async function AdminPage() {
  const auth = await validateRequest();
  if (!auth.user) return notFound();
  const jobPostings = await getAllJobPostings();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">All job postings</h1>
      {jobPostings.map((jobPosting) => (
        <JobPostingCard
          href={`/dashboard/edit/${jobPosting.id}`}
          {...jobPosting}
          key={jobPosting.id}
        />
      ))}
    </div>
  );
}
