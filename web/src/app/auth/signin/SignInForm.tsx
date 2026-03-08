"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

type Props = { callbackUrl?: string };

export function SignInForm({ callbackUrl = "/" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCallback = searchParams.get("callbackUrl") ?? callbackUrl;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: urlCallback,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError(result.error === "CredentialsSignin" ? "Invalid email or password." : result.error);
      return;
    }
    if (result?.ok && result?.url) {
      const url = new URL(result.url, window.location.origin);
      url.searchParams.set("signedIn", "1");
      router.push(url.pathname + url.search);
      router.refresh();
      return;
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-300">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-xl border border-slate-600 bg-slate-800/50 px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-300">Mật khẩu</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="rounded-xl border border-slate-600 bg-slate-800/50 px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
            placeholder="Mật khẩu"
          />
        </label>
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-amber-500 px-4 py-2.5 font-semibold text-slate-900 transition hover:bg-amber-400 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          {loading ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-400">
        Chưa có tài khoản?{" "}
        <Link href={`/auth/signup?callbackUrl=${encodeURIComponent(urlCallback)}`} className="text-amber-400 underline hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
          Tạo tài khoản
        </Link>
      </p>
    </>
  );
}
