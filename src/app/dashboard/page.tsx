import { JobPostingCard } from "@/components/job-posting-card";
import { getMyJobPostings } from "@/server/api/job-postings";
import { validateRequest } from "@/server/auth";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Dashboard() {
  const auth = await validateRequest();
  if (!auth.user) return notFound();
  const myJobPostings = await getMyJobPostings();
  if (myJobPostings.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-2xl font-bold text-white">
          You don{"'"}t have any job postings.
        </h1>
        <Link href="/dashboard/new" className="btn">
          Create one
        </Link>
      </div>
    );
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Your job postings</h1>
      {myJobPostings.map((jobPosting) => (
        <JobPostingCard
          href={`/dashboard/edit/${jobPosting.id}`}
          {...jobPosting}
          key={jobPosting.id}
        />
      ))}
    </div>
  );
}
