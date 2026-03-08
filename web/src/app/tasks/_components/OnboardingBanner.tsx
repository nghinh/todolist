"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const DISMISS_KEY = "todolist-onboarding-dismissed";

export function OnboardingBanner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onboarding = searchParams.get("onboarding") === "1";
    const dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
    setVisible(onboarding && !dismissed);
  }, [searchParams]);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    router.replace("/tasks", { scroll: false });
  }

  if (!visible) return null;

  return (
    <div
      className="mb-6 rounded-2xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 shadow-lg"
      role="region"
      aria-label="Get started"
    >
      <p className="font-medium text-slate-100">
        Chào mừng! Thêm task đầu tiên ở form bên dưới để bắt đầu.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={dismiss}
          className="rounded-xl bg-amber-500 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          aria-label="Dismiss welcome message"
        >
          Đã hiểu
        </button>
        <Link
          href="/today"
          className="text-sm text-amber-400 underline hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Hoặc xem Hôm nay
        </Link>
      </div>
    </div>
  );
}
