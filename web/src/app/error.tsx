"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-8 text-white">
      <div className="max-w-lg rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6">
        <h2 className="mb-2 text-xl font-bold text-slate-100">Đã xảy ra lỗi</h2>
        <p className="mb-4 text-sm text-slate-400">
          {error.message || "Lỗi kết nối hoặc cấu hình. Trên production hãy kiểm tra DATABASE_URL (Supabase: dùng Connection pooling port 6543) và AUTH_SECRET."}
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="/" className="rounded-xl bg-amber-500 px-4 py-2 font-semibold text-slate-900 no-underline hover:bg-amber-400">Trang chủ</a>
          <a href="/auth/signin" className="rounded-xl border border-slate-600 px-4 py-2 text-slate-200 no-underline hover:bg-slate-800">Đăng nhập</a>
          <button type="button" onClick={() => reset()} className="rounded-xl border border-slate-600 px-4 py-2 text-slate-200 hover:bg-slate-800">Thử lại</button>
        </div>
      </div>
    </main>
  );
}
