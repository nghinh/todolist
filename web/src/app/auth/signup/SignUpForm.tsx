"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpFormAction } from "~/server/auth/sign-up";

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpFormAction, null);

  return (
    <>
      <form action={formAction} className="flex flex-col gap-4">
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
            minLength={8}
            autoComplete="new-password"
            className="rounded-xl border border-slate-600 bg-slate-800/50 px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
            placeholder="Ít nhất 8 ký tự"
          />
        </label>
        {state?.ok === false && (
          <p className="text-sm text-red-400" role="alert">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          className="rounded-xl bg-amber-500 px-4 py-2.5 font-semibold text-slate-900 transition hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Tạo tài khoản
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-400">
        Đã có tài khoản?{" "}
        <Link href="/auth/signin?callbackUrl=/" className="text-amber-400 underline hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
          Đăng nhập
        </Link>
      </p>
    </>
  );
}
