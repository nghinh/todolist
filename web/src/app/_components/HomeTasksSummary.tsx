"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";

export function HomeTasksSummary() {
  const [mounted, setMounted] = useState(false);
  const { data: tasks, isLoading } = api.task.getMyTasks.useQuery();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="flex w-full flex-col rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 shadow-lg"
      role="region"
      aria-label="Your tasks summary"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </span>
        <h2 className="text-lg font-semibold text-slate-100">Task của bạn</h2>
      </div>
      {!mounted || isLoading ? (
        <p className="text-slate-400">Đang tải...</p>
      ) : tasks?.length === 0 ? (
        <>
          <p className="text-slate-300">Chưa có task. Thêm task đầu tiên để bắt đầu.</p>
          <Link
            href="/tasks?onboarding=1"
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-900 no-underline transition hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Thêm task đầu tiên
          </Link>
        </>
      ) : (
        <>
          <p className="text-2xl font-bold tabular-nums text-slate-100">
            {(tasks ?? []).length} task{(tasks ?? []).length === 1 ? "" : "s"}
          </p>
          <p className="mt-1 text-sm text-slate-400">Trong danh sách của bạn</p>
          <Link
            href="/tasks"
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-semibold no-underline transition hover:border-slate-500 hover:bg-slate-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Xem & quản lý
          </Link>
        </>
      )}
    </div>
  );
}
