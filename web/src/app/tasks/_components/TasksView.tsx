"use client";

import { useMemo, useState } from "react";

import { api, type RouterOutputs } from "~/trpc/react";

import { TaskRow } from "~/app/_components/TaskRow";
import { TaskRowSkeleton } from "~/app/_components/TaskRowSkeleton";

type TaskFromList = NonNullable<RouterOutputs["task"]["getMyTasks"]>[number];
type ProjectFromList = NonNullable<RouterOutputs["project"]["list"]>[number];

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function TasksView() {
  const [projectId, setProjectId] = useState<string>("");
  const [orderBy, setOrderBy] = useState<"sortOrder" | "dueDate" | "priority">("sortOrder");

  const utils = api.useUtils();
  const { data: tasksRaw, isLoading, error } = api.task.getMyTasks.useQuery({
    projectId: projectId || undefined,
    orderBy: orderBy === "priority" ? "sortOrder" : orderBy,
  });
  const { data: projects } = api.project.list.useQuery();

  const tasks = useMemo(() => {
    if (!tasksRaw) return tasksRaw;
    if (orderBy !== "priority") return tasksRaw;
    return [...tasksRaw].sort((a, b) => {
      const pa = a.priority ? PRIORITY_ORDER[a.priority] ?? 3 : 3;
      const pb = b.priority ? PRIORITY_ORDER[b.priority] ?? 3 : 3;
      return pa - pb;
    });
  }, [tasksRaw, orderBy]);
  const createProject = api.project.create.useMutation({
    onSuccess: () => void utils.project.list.invalidate(),
  });
  const createTask = api.task.create.useMutation({
    onSuccess: () => void utils.task.getMyTasks.invalidate(),
  });
  const updateTask = api.task.update.useMutation({
    onSuccess: () => void utils.task.getMyTasks.invalidate(),
  });
  const reorderTask = api.task.reorder.useMutation({
    onSuccess: () => void utils.task.getMyTasks.invalidate(),
  });
  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => void utils.task.getMyTasks.invalidate(),
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value.trim();
    const projectId = (form.elements.namedItem("projectId") as HTMLSelectElement).value.trim() || undefined;
    if (!title) return;
    createTask.mutate(
      { title, projectId: projectId ?? null },
      { onSuccess: () => form.reset() },
    );
  }

  if (error) {
    return (
      <p className="text-red-400" role="alert">
        Tải task thất bại. Vui lòng tải lại trang.
      </p>
    );
  }

  const [newProjectName, setNewProjectName] = useState("");

  function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    const name = newProjectName.trim();
    if (!name) return;
    createProject.mutate({ name }, { onSuccess: () => setNewProjectName("") });
  }

  const mutationError =
    createProject.isError ||
    createTask.isError ||
    updateTask.isError ||
    reorderTask.isError ||
    deleteTask.isError;
  const errorMessage =
    createProject.error?.message ??
    createTask.error?.message ??
    updateTask.error?.message ??
    deleteTask.error?.message ??
    reorderTask.error?.message;

  function handleRetry() {
    void utils.task.getMyTasks.invalidate();
    void utils.project.list.invalidate();
    createProject.reset();
    createTask.reset();
    updateTask.reset();
    reorderTask.reset();
    deleteTask.reset();
  }

  return (
    <div className="flex flex-col gap-6" suppressHydrationWarning>
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
      <form onSubmit={handleAddProject} className="flex gap-2">
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="Tên dự án mới..."
          aria-label="New project name"
          className="max-w-xs rounded-xl border border-slate-600 bg-slate-800/50 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 disabled:opacity-50"
          disabled={createProject.isPending}
        />
        <button
          type="submit"
          disabled={createProject.isPending || !newProjectName.trim()}
          className="rounded-xl border border-slate-600 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Thêm dự án
        </button>
      </form>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
        <input
          type="text"
          name="title"
          placeholder="Task mới..."
          aria-label="Task title"
          className="min-w-0 flex-1 rounded-xl border border-slate-600 bg-slate-800/50 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 disabled:opacity-50"
          disabled={createTask.isPending}
        />
        <label className="flex items-center gap-2 text-sm text-slate-400">
          <span className="shrink-0">Dự án</span>
          <select
            name="projectId"
            className="rounded-xl border border-slate-600 bg-slate-800/50 px-2 py-2 text-slate-100 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 disabled:opacity-50"
            aria-label="Project"
            disabled={createTask.isPending}
          >
            <option value="">Không</option>
            {projects?.map((p: ProjectFromList) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={createTask.isPending}
          className="rounded-xl bg-amber-500 px-4 py-2 font-semibold text-slate-900 transition hover:bg-amber-400 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Thêm
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-400">
          <span>Lọc theo dự án</span>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="rounded-xl border border-slate-600 bg-slate-800/50 px-2 py-1.5 text-slate-100 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
            aria-label="Filter by project"
          >
            <option value="">Tất cả</option>
            {projects?.map((p: ProjectFromList) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-400">
          <span>Sắp xếp</span>
          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value as "sortOrder" | "dueDate" | "priority")}
            className="rounded-xl border border-slate-600 bg-slate-800/50 px-2 py-1.5 text-slate-100 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
            aria-label="Sort tasks by"
          >
            <option value="sortOrder">Mặc định</option>
            <option value="dueDate">Hạn</option>
            <option value="priority">Ưu tiên</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <ul className="flex flex-col gap-2" role="list" aria-label="Loading tasks">
          {[1, 2, 3, 4].map((i) => (
            <TaskRowSkeleton key={i} />
          ))}
        </ul>
      ) : !tasks?.length ? (
        <p className="text-slate-400">Chưa có task. Thêm ở trên.</p>
      ) : (
        <ul className="flex flex-col gap-2" role="list" aria-label="Task list">
          {tasks.map((task: TaskFromList, index: number) => (
            <TaskRow
              key={task.id}
              task={task}
              index={index}
              total={tasks.length}
              onUpdate={(input) =>
                updateTask.mutate({
                  ...input,
                  status: input.status as "todo" | "in_progress" | "blocked" | "done" | undefined,
                  priority: input.priority as "high" | "medium" | "low" | null | undefined,
                })
              }
              onReorder={reorderTask.mutate}
              onDelete={deleteTask.mutate}
              isUpdating={updateTask.isPending}
              isDeleting={deleteTask.isPending}
              isReordering={reorderTask.isPending}
              showReorder={true}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
