"use client";

import { useActionState, useId, useState, type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

export const JobPostingForm = ({
  action,
  data,
}: {
  action: (_: unknown, formData: FormData) => Promise<{ error: string }>;
  data?: {
    title: string;
    salaryRange: string;
    location: string;
    description: string;
    tags: string[];
    applicationLink: string;
    companyName: string;
  };
}) => {
  const [actionState, realAction] = useActionState(action, null);

  return (
    <form className="mx-auto max-w-lg space-y-4" action={realAction}>
      <Input
        label="Title"
        maxLength={256}
        name="title"
        defaultValue={data?.title}
      />
      <Input
        label="Salary range (Required)"
        maxLength={256}
        name="salaryRange"
        defaultValue={data?.salaryRange}
      />
      <Input
        label="Location"
        maxLength={256}
        name="location"
        defaultValue={data?.location}
      />
      <Input
        label="Company Name"
        maxLength={256}
        name="companyName"
        defaultValue={data?.companyName}
      />
      <Textarea
        label="Job Description"
        maxLength={1024}
        name="description"
        defaultValue={data?.description}
      />
      <Input
        label="Link for applicants"
        maxLength={256}
        type="url"
        name="applicationLink"
        defaultValue={data?.applicationLink}
      />
      <TagInput defaultValue={data?.tags} />
      {actionState?.error && (
        <p className="text-red-500">{actionState.error}</p>
      )}
      <SubmitButton />
    </form>
  );
};

const Input = ({
  label,
  ...props
}: {
  label: string;
} & ComponentProps<"input">) => {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        required
        id={id}
        type="text"
        className="block w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2"
        {...props}
      />
    </div>
  );
};

const Textarea = ({
  label,
  ...props
}: {
  label: string;
} & ComponentProps<"textarea">) => {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        required
        id={id}
        rows={10}
        className="block max-h-72 min-h-32 w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 [field-sizing:content]"
        {...props}
      />
    </div>
  );
};

const TagInput = ({ defaultValue = [] }: { defaultValue?: string[] }) => {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        Tags
      </label>
      <input type="hidden" name="tags" value={tags.join(",")} />
      <div className="flex w-full flex-wrap gap-2 rounded-md border border-zinc-800 bg-zinc-900 p-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-1 rounded bg-zinc-800 px-1 py-0.5"
          >
            #{tag}
            <button
              onClick={() => setTags(tags.filter((t) => t !== tag))}
              className="grid size-4 place-content-center rounded-full bg-zinc-900 text-xs text-zinc-200"
            >
              x
            </button>
          </div>
        ))}
        <input
          id={id}
          className="w-full bg-transparent"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " " || e.key === ",") {
              e.preventDefault();
              const value = e.currentTarget.value;
              if (!tags.includes(value) && value)
                setTags((tags) => [...tags, value]);
              e.currentTarget.value = "";
            }
          }}
          pattern="[a-zA-Z0-9]+"
          maxLength={16}
        />
      </div>
    </div>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      Submit
    </button>
  );
};
