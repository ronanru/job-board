import { JobPostingCard } from "@/components/job-posting-card";
import { getHomePageJobPostings } from "@/server/api/job-postings";

export default async function HomePage() {
  const jobPostings = await getHomePageJobPostings();
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-white">New job postings</h1>
      {jobPostings.map((jobPosting) => (
        <JobPostingCard
          href={`/job/${jobPosting.id}`}
          key={jobPosting.id}
          {...jobPosting}
        />
      ))}
    </section>
  );
}
