"use client";
import { archiveJobPosting, deleteJobPosting } from "@/server/api/job-postings";

export const JobPostingToolbar = (props: {
  title: string;
  id: string;
  isArchived: boolean;
}) => {
  return (
    <div className="flex justify-center gap-4">
      <button
        type="button"
        className="btn bg-red-600 text-white block"
        onClick={async () => {
          if (
            !window.confirm(
              `Are you sure you want to delete the job posting "${props.title}"?`,
            )
          )
            return;
          const result = await deleteJobPosting(props.id);
          if (result?.error) alert(result.error);
        }}
      >
        Delete
      </button>{" "}
      {!props.isArchived && (
        <button
          type="button"
          className="btn bg-amber-600 text-white block"
          onClick={async () => {
            if (
              !window.confirm(
                `Are you sure you want to archive the job posting "${props.title}"?`,
              )
            )
              return;
            const result = await archiveJobPosting(props.id);
            if (result?.error) alert(result.error);
          }}
        >
          Archive
        </button>
      )}
    </div>
  );
};
