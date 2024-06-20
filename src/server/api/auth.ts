"use server";

import { cookies } from "next/headers";
import { lucia, validateRequest } from "../auth";
import { redirect } from "next/navigation";

export const logout = async () => {
  "use server";
  const { session } = await validateRequest();
  if (!session) return;

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
};
