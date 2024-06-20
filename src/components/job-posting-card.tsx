import Link from "next/link";

export const JobPostingCard = (props: {
  href: string;
  title: string;
  createdAt: Date;
  tags: string[];
  salaryRange: string;
  location: string;
  companyName: string;
  isApproved?: boolean;
  isArchived?: boolean;
}) => (
  <Link
    href={props.href}
    className="p-4 rounded-xl bg-zinc-900 block space-y-1"
  >
    <p className="text-white font-bold text-2xl">
      {props.title}
      {props.isApproved === false && " (on review)"}
      {props.isArchived && " (archived)"}
    </p>
    <p>
      {props.companyName} - {props.salaryRange} - {props.location} -{" "}
      <time dateTime={props.createdAt.toISOString()}>
        {props.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
    </p>
    <div className="flex items-center flex-wrap gap-2">
      {props.tags.map((tag) => (
        <div
          key={tag}
          className="flex items-center gap-1 rounded bg-zinc-800 px-1 py-0.5"
        >
          #{tag}
        </div>
      ))}
    </div>
  </Link>
);
