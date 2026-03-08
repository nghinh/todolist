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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-8 text-white">
      <div className="max-w-lg rounded-xl bg-red-900/30 p-6">
        <h2 className="mb-2 text-xl font-bold">Something went wrong</h2>
        <p className="mb-4 font-mono text-sm text-red-200">
          {error.message}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded bg-white/20 px-4 py-2 font-semibold hover:bg-white/30"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
