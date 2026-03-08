import { type Metadata } from "next";

import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Đăng nhập | TodoList",
  description: "Đăng nhập vào tài khoản TodoList của bạn.",
};

type Props = { searchParams: Promise<{ callbackUrl?: string }> };

export default async function SignInPage(props: Props) {
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams.callbackUrl ?? "/";

  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white" role="main" aria-label="Sign in">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(56,189,248,0.08),transparent)]" />
      <div className="w-full max-w-sm rounded-2xl border border-slate-700/50 bg-slate-800/30 p-8 shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-100">Đăng nhập</h1>
        <SignInForm callbackUrl={callbackUrl} />
      </div>
    </main>
  );
}
