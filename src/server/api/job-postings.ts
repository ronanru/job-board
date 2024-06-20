"use server";
import { and, desc, eq, sql } from "drizzle-orm";
import { unstable_cache as cache, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import * as v from "valibot";
import { validateRequest } from "../auth";
import { db } from "../db";
import { jobPostings } from "../db/schema";

export const getHomePageJobPostings = cache(
  async () =>
    await db.query.jobPostings.findMany({
      columns: {
        id: true,
        title: true,
        salaryRange: true,
        location: true,
        tags: true,
        createdAt: true,
        companyName: true,
      },
      where: and(
        eq(jobPostings.isApproved, true),
        eq(jobPostings.isArchived, false),
      ),
      limit: 25,
      orderBy: desc(jobPostings.createdAt),
    }),
  ["jobPostings", "homePage"],
  {
    tags: ["jobPostings"],
  },
);

export const getJobPostingById = cache(
  async (id: string) =>
    await db.query.jobPostings.findFirst({
      where: and(
        eq(jobPostings.id, id),
        eq(jobPostings.isApproved, true),
        eq(jobPostings.isArchived, false),
      ),
      columns: {
        location: true,
        title: true,
        salaryRange: true,
        tags: true,
        description: true,
        createdAt: true,
        applicationLink: true,
      },
    }),
  ["jobPostingById", "byId"],
  {
    tags: ["jobPostings"],
  },
);

export const getMyJobPostings = async () => {
  const auth = await validateRequest();
  if (!auth.session) return [];
  return await db.query.jobPostings.findMany({
    where: auth.user.isAdmin ? undefined : eq(jobPostings.userId, auth.user.id),
  });
};

const jobPostingsSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1), v.maxLength(256)),
  salaryRange: v.pipe(v.string(), v.minLength(1), v.maxLength(256)),
  location: v.pipe(v.string(), v.minLength(1), v.maxLength(256)),
  description: v.pipe(v.string(), v.minLength(1), v.maxLength(1024)),
  tags: v.pipe(
    v.string(),
    v.transform((tags) => (tags === "" ? [] : tags.split(","))),
  ),
  companyName: v.pipe(v.string(), v.minLength(1), v.maxLength(256)),
  applicationLink: v.pipe(v.string(), v.url(), v.maxLength(256)),
});

export const createJobPosting = async (_: unknown, formData: FormData) => {
  const auth = await validateRequest();
  if (!auth.user)
    return { error: "You must be logged in to create a job posting." };
  const input = v.safeParse(
    jobPostingsSchema,
    Object.fromEntries(formData.entries()),
  );
  if (!input.success)
    return {
      error: input.issues[0].message,
    };
  await db.insert(jobPostings).values({
    ...input.output,
    userId: auth.user.id,
  });
  return redirect("/dashboard");
};

export const getMyJobPostingById = async (id: string) => {
  const auth = await validateRequest();
  if (!auth.user) return null;
  const [jobPosting] = await db.query.jobPostings.findMany({
    where: and(
      eq(jobPostings.id, id),
      auth.user.isAdmin ? sql`TRUE` : eq(jobPostings.userId, auth.user.id),
    ),
  });
  if (!jobPosting) return null;
  return jobPosting;
};

export const deleteJobPosting = async (id: string) => {
  const auth = await validateRequest();
  if (!auth.user)
    return { error: "You must be logged in to delete a job posting." };
  await db
    .delete(jobPostings)
    .where(
      and(
        eq(jobPostings.id, id),
        auth.user.isAdmin ? sql`TRUE` : eq(jobPostings.userId, auth.user.id),
      ),
    );
  revalidateTag("jobPostings");
  return redirect("/dashboard");
};

export const archiveJobPosting = async (id: string) => {
  const auth = await validateRequest();
  if (!auth.user)
    return { error: "You must be logged in to archive a job posting." };
  await db
    .update(jobPostings)
    .set({
      isArchived: true,
    })
    .where(
      and(
        eq(jobPostings.id, id),
        auth.user.isAdmin ? sql`TRUE` : eq(jobPostings.userId, auth.user.id),
      ),
    );
  revalidateTag("jobPostings");
  return redirect("/dashboard");
};

export const updateJobPosting = async (
  id: string,
  _: unknown,
  formData: FormData,
) => {
  const auth = await validateRequest();
  if (!auth.user)
    return { error: "You must be logged in to update a job posting." };
  const input = v.safeParse(
    jobPostingsSchema,
    Object.fromEntries(formData.entries()),
  );
  if (!input.success)
    return {
      error: input.issues[0].message,
    };
  await db
    .update(jobPostings)
    .set({
      ...input.output,
      updatedAt: new Date(),
      isApproved: auth.user.isAdmin,
    })
    .where(
      and(
        eq(jobPostings.id, id),
        auth.user.isAdmin
          ? sql`TRUE`
          : and(
              eq(jobPostings.userId, auth.user.id),
              eq(jobPostings.isArchived, false),
            ),
      ),
    );
  if (auth.user.isAdmin) revalidateTag("jobPostings");
  return redirect("/dashboard");
};

export const getAllJobPostings = async () => {
  const auth = await validateRequest();
  if (!auth.user?.isAdmin) return [];
  return await db.query.jobPostings.findMany({
    columns: {
      id: true,
      title: true,
      salaryRange: true,
      location: true,
      tags: true,
      createdAt: true,
      companyName: true,
    },
    orderBy: desc(jobPostings.createdAt),
  });
};
