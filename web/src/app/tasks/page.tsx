import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

import { OnboardingBanner } from "./_components/OnboardingBanner";
import { TasksView } from "./_components/TasksView";

export const metadata: Metadata = {
  title: "Task của tôi | TodoList",
  description: "Danh sách task của bạn — lọc theo dự án, sắp xếp theo hạn hoặc ưu tiên.",
};

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/tasks");
  }

  return (
    <main id="main-content" className="min-h-screen bg-slate-950 text-white" role="main" aria-label="My tasks" suppressHydrationWarning>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" suppressHydrationWarning />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(56,189,248,0.08),transparent)]" suppressHydrationWarning />
      <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-12" suppressHydrationWarning>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4" suppressHydrationWarning>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">Task của tôi</h1>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Điều hướng">
            <a
              href="/"
              className="rounded-xl border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm font-medium no-underline transition hover:border-slate-500 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Trang chủ
            </a>
            <a
              href="/today"
              className="rounded-xl border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm font-medium no-underline transition hover:border-slate-500 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Hôm nay
            </a>
            <a
              href="/api/auth/signout"
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 no-underline transition hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Đăng xuất
            </a>
          </nav>
        </div>
        <OnboardingBanner />
        <TasksView />
      </div>
    </main>
  );
}
