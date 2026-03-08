"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function SignedInBanner() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      router.replace("/", { scroll: false });
    }, 4000);
    return () => clearTimeout(t);
  }, [router]);

  if (!visible) return null;

  return (
    <div
      className="rounded-xl border border-emerald-500/30 bg-emerald-950/50 px-4 py-3 text-emerald-100 shadow-lg"
      role="status"
      aria-live="polite"
    >
      <p className="font-medium">Đăng nhập thành công.</p>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          router.replace("/", { scroll: false });
        }}
        className="mt-1 text-sm font-medium text-emerald-200 underline-offset-2 hover:text-emerald-100 hover:underline"
        aria-label="Đóng thông báo"
      >
        Đóng
      </button>
    </div>
  );
}
