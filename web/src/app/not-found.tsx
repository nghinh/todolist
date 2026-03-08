import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1 className="text-2xl font-bold">404 – Not found</h1>
      <Link href="/" className="mt-4 text-white/80 underline hover:text-white">
        Back to home
      </Link>
    </main>
  );
}
