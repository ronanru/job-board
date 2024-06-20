import { getJobPostingById } from "@/server/api/job-postings";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

export default async function JobPage({ params }: { params: { id: string } }) {
  const jobPosting = await getJobPostingById(params.id);
  if (!jobPosting) return notFound();
  return (
    <article className="space-y-4">
      <h1 className="text-4xl font-bold">{jobPosting.title}</h1>
      <p>
        {jobPosting.salaryRange} - {jobPosting.location} -{" "}
        <time dateTime={jobPosting.createdAt.toISOString()}>
          {jobPosting.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </p>
      <Markdown allowedElements={["p", "ul", "ol", "li", "b", "u", "s"]}>
        {jobPosting.description}
      </Markdown>
      <div>
        <Link
          href={jobPosting.applicationLink}
          target="_blank"
          className="btn block max-w-max"
        >
          Apply
        </Link>
      </div>
    </article>
  );
}
