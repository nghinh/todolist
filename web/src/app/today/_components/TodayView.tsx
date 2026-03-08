"use client";

import Link from "next/link";

import { api } from "~/trpc/react";

import { TaskRow } from "~/app/_components/TaskRow";
import { formatDueDate } from "~/app/_components/TaskRow";
import { TaskRowSkeleton } from "~/app/_components/TaskRowSkeleton";

export function TodayView() {
  const utils = api.useUtils();
  const { data: todayTasks, isLoading, error } = api.task.getTodayTasks.useQuery();
  const { data: overdueTasks } = api.task.getOverdueTasks.useQuery();
  const { data: upcomingTasks } = api.task.getUpcomingTasks.useQuery();

  const updateTask = api.task.update.useMutation({
    onSuccess: () => {
      void utils.task.getTodayTasks.invalidate();
      void utils.task.getMyTasks.invalidate();
      void utils.task.getOverdueTasks.invalidate();
      void utils.task.getUpcomingTasks.invalidate();
    },
  });
  const reorderTask = api.task.reorder.useMutation({
    onSuccess: () => {
      void utils.task.getTodayTasks.invalidate();
      void utils.task.getMyTasks.invalidate();
    },
  });
  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      void utils.task.getTodayTasks.invalidate();
      void utils.task.getMyTasks.invalidate();
      void utils.task.getOverdueTasks.invalidate();
      void utils.task.getUpcomingTasks.invalidate();
    },
  });

  if (error) {
    return (
      <p className="text-red-400" role="alert">
        Tải thất bại. Vui lòng tải lại trang.
      </p>
    );
  }

  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000 - 1);

  const overdue = todayTasks?.filter((t) => t.dueDate && t.dueDate < startOfToday) ?? [];
  const dueToday = todayTasks?.filter(
    (t) => t.dueDate && t.dueDate >= startOfToday && t.dueDate <= endOfToday,
  ) ?? [];
  const noDate = todayTasks?.filter((t) => !t.dueDate) ?? [];

  const mutationError = updateTask.isError || reorderTask.isError || deleteTask.isError;
  const errorMessage =
    updateTask.error?.message ?? deleteTask.error?.message ?? reorderTask.error?.message;

  function handleRetry() {
    void utils.task.getTodayTasks.invalidate();
    void utils.task.getMyTasks.invalidate();
    void utils.task.getOverdueTasks.invalidate();
    void utils.task.getUpcomingTasks.invalidate();
    updateTask.reset();
    reorderTask.reset();
    deleteTask.reset();
  }

  return (
    <div className="flex flex-col gap-8" suppressHydrationWarning>
      {mutationError && (
        <div
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-red-200"
          role="alert"
        >
          <span>{errorMessage ?? "Có lỗi. Vui lòng thử lại."}</span>
          <button
            type="button"
            onClick={handleRetry}
            className="shrink-0 rounded-lg bg-red-500/30 px-3 py-1.5 text-sm font-medium hover:bg-red-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Thử lại
          </button>
        </div>
      )}
      <p className="text-slate-400">
        Task hôm nay, quá hạn hoặc chưa đặt hạn.{" "}
        <Link href="/tasks" className="text-amber-400 underline hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
          Tất cả task
        </Link>
      </p>

      {isLoading ? (
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-100">Hôm nay</h2>
            <ul className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <TaskRowSkeleton key={i} />
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <>
          {overdue.length > 0 && (
            <section>
              <h2 className="mb-2 text-lg font-semibold text-red-300">Quá hạn</h2>
              <ul className="flex flex-col gap-2">
                {overdue.map((task, index) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    index={index}
                    total={overdue.length}
                    onUpdate={updateTask.mutate}
                    onReorder={reorderTask.mutate}
                    onDelete={deleteTask.mutate}
                    isUpdating={updateTask.isPending}
                    isDeleting={deleteTask.isPending}
                    isReordering={reorderTask.isPending}
                    showReorder={false}
                  />
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-100">Hôm nay</h2>
            {dueToday.length === 0 && overdue.length === 0 && noDate.length === 0 ? (
              <p className="text-slate-400">Chưa có task cho hôm nay. Thêm từ trang task hoặc đặt hạn.</p>
            ) : dueToday.length === 0 ? (
              <p className="text-slate-400">Không có task đến hạn hôm nay.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {dueToday.map((task, index) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    index={index}
                    total={dueToday.length}
                    onUpdate={updateTask.mutate}
                    onReorder={reorderTask.mutate}
                    onDelete={deleteTask.mutate}
                    isUpdating={updateTask.isPending}
                    isDeleting={deleteTask.isPending}
                    isReordering={reorderTask.isPending}
                    showReorder={false}
                  />
                ))}
              </ul>
            )}
          </section>

          {noDate.length > 0 && (
            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-100">Chưa đặt hạn</h2>
              <ul className="flex flex-col gap-2">
                {noDate.map((task, index) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    index={index}
                    total={noDate.length}
                    onUpdate={updateTask.mutate}
                    onReorder={reorderTask.mutate}
                    onDelete={deleteTask.mutate}
                    isUpdating={updateTask.isPending}
                    isDeleting={deleteTask.isPending}
                    isReordering={reorderTask.isPending}
                    showReorder={false}
                  />
                ))}
              </ul>
            </section>
          )}

          {upcomingTasks && upcomingTasks.length > 0 && (
            <section>
              <h2 className="mb-2 text-lg font-semibold text-slate-100">Sắp tới</h2>
              <p className="text-sm text-slate-400">
                {upcomingTasks.length} task đến hạn sau.{" "}
                <Link href="/tasks" className="text-amber-400 underline hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
                  Xem tất cả
                </Link>
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {upcomingTasks.slice(0, 5).map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/30 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-slate-200">{task.title}</span>
                    <span className="text-slate-400">{task.dueDate ? formatDueDate(task.dueDate) : ""}</span>
                  </li>
                ))}
                {upcomingTasks.length > 5 && (
                  <li className="text-center text-sm text-slate-400">
                    +{upcomingTasks.length - 5} nữa
                  </li>
                )}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
