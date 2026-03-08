import Link from "next/link";
import type { Session } from "next-auth";

import { HomeTasksSummary } from "~/app/_components/HomeTasksSummary";
import { SignedInBanner } from "~/app/_components/SignedInBanner";
import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

type PageProps = { searchParams: Promise<{ signedIn?: string }> };

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const showSignedInBanner = searchParams.signedIn === "1";
  let session: Session | null = null;
  let errorMessage: string | null = null;

  try {
    session = await auth();
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : String(e);
  }

  if (session?.user) {
    try {
      void api.task.getMyTasks.prefetch();
      void api.post.getLatest.prefetch();
    } catch {
      // ignore prefetch error
    }
  }

  if (errorMessage) {
    return (
      <main id="main-content" className="flex min-h-screen flex-col items-center justify-center bg-red-950/50 p-8 text-white" role="main">
        <p className="font-mono text-red-200">Error: {errorMessage}</p>
        <pre className="mt-4 max-w-2xl overflow-auto text-xs text-red-300">
          {errorMessage}
        </pre>
      </main>
    );
  }

  return (
    <HydrateClient>
      <main
        id="main-content"
        className="min-h-screen bg-slate-950 text-white"
        role="main"
        suppressHydrationWarning
      >
        {/* Subtle gradient mesh background */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" suppressHydrationWarning />
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(56,189,248,0.08),transparent)]" suppressHydrationWarning />

        <div className="container mx-auto flex min-h-screen flex-col px-4 py-12 sm:py-16" suppressHydrationWarning>
          {showSignedInBanner && (
            <div className="mb-6">
              <SignedInBanner />
            </div>
          )}

          {/* Header */}
          <header className="mb-12 flex flex-col items-center text-center sm:mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                TodoList
              </span>
            </h1>
            <p className="mt-3 max-w-md text-slate-400 sm:text-lg">
              {session
                ? `Xin chào, ${session.user?.name ?? session.user?.email ?? "bạn"}`
                : "Quản lý công việc đơn giản — hôm nay, dự án, và hơn thế."}
            </p>
          </header>

          {session ? (
            /* Logged-in: quick actions + summary cards */
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10" suppressHydrationWarning>
              <div className="flex flex-wrap justify-center gap-3" suppressHydrationWarning>
                <Link
                  href="/today"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 font-semibold text-slate-900 no-underline shadow-lg shadow-amber-500/25 transition hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Hôm nay
                </Link>
                <Link
                  href="/tasks"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/50 px-6 py-3.5 font-semibold no-underline transition hover:border-slate-500 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Tất cả task
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="inline-flex items-center rounded-xl px-4 py-3.5 text-sm font-medium text-slate-400 no-underline transition hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Đăng xuất
                </Link>
              </div>

              <div className="grid w-full gap-6 sm:grid-cols-2" suppressHydrationWarning>
                <HomeTasksSummary />
                <LatestPost />
              </div>
            </div>
          ) : (
            /* Guest: sign in / sign up CTA */
            <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-8">
              <div className="w-full rounded-2xl border border-slate-700/50 bg-slate-800/30 p-8 shadow-xl">
                <p className="mb-6 text-center text-slate-300">
                  Đăng nhập hoặc tạo tài khoản để bắt đầu quản lý công việc.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/auth/signin?callbackUrl=/"
                    className="block rounded-xl bg-amber-500 py-3.5 text-center font-semibold text-slate-900 no-underline transition hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block rounded-xl border border-slate-600 py-3.5 text-center font-semibold no-underline transition hover:border-slate-500 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    Tạo tài khoản
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
