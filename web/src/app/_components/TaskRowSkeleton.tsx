export function TaskRowSkeleton() {
  return (
    <li
      className="flex flex-col gap-1 rounded-2xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 shadow-lg"
      aria-hidden
    >
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-600/50" />
          <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-slate-600/30" />
        </div>
      </div>
    </li>
  );
}
