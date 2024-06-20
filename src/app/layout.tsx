import { logout } from "@/server/api/auth";
import { validateRequest } from "@/server/auth";
import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Job Board",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} scroll-smooth [color-scheme:dark]`}
    >
      <body className="container mx-auto flex min-h-screen flex-col gap-8 bg-zinc-950 p-4 text-zinc-100">
        <header className="flex items-center justify-between rounded-xl bg-zinc-800 p-4">
          <Link href="/" className="text-lg font-bold">
            Job Board
          </Link>
          <Suspense>
            <UserButton />
          </Suspense>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

export const UserButton = async () => {
  const auth = await validateRequest();
  if (!auth.session) return <Link href="/auth/login">Sign in</Link>;
  return (
    <nav className="flex items-center justify-between gap-4">
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>
      {auth.user?.isAdmin && <Link href="/dashboard/admin">Admin</Link>}
      <button formAction={logout}>Sign out</button>
    </nav>
  );
};
