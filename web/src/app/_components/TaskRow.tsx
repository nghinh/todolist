"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export const PRIORITY_LABELS: Record<string, string> = { high: "Cao", medium: "Trung bình", low: "Thấp" };
export const STATUS_LABELS: Record<string, string> = {
  todo: "Cần làm",
  in_progress: "Đang làm",
  blocked: "Bị chặn",
  done: "Xong",
};

export function formatDueDate(d: Date | null): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(undefined, { dateStyle: "short" });
}

export type TaskRowTask = {
  id: string;
  title: string;
  notes: string | null;
  dueDate: Date | null;
  priority: string | null;
  status: string;
  blockedNote: string | null;
  projectId?: string | null;
  project?: { id: string; name: string } | null;
};

export function TaskRow({
  task,
  index,
  total,
  onUpdate,
  onReorder,
  onDelete,
  isUpdating,
  isDeleting,
  isReordering,
  showReorder = true,
}: {
  task: TaskRowTask;
  index: number;
  total: number;
  onUpdate: (input: {
    id: string;
    title?: string;
    notes?: string | null;
    dueDate?: string | null;
    priority?: string | null;
    status?: string;
    blockedNote?: string | null;
    projectId?: string | null;
  }) => void;
  onReorder: (input: { id: string; direction: "up" | "down" }) => void;
  onDelete: (input: { id: string }) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isReordering: boolean;
  showReorder?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes ?? "");
  const dueDateRaw = task.dueDate ? (typeof task.dueDate === "string" ? task.dueDate : task.dueDate.toISOString()).slice(0, 10) : "";
  const [dueDate, setDueDate] = useState(dueDateRaw);
  const [priority, setPriority] = useState<string>(task.priority ?? "");
  const [status, setStatus] = useState<string>(task.status || "todo");
  const [blockedNote, setBlockedNote] = useState(task.blockedNote ?? "");
  const [projectId, setProjectId] = useState<string>(task.projectId ?? "");
  const [showBlockedNoteInput, setShowBlockedNoteInput] = useState(false);
  const [quickBlockedNote, setQuickBlockedNote] = useState("");

  const { data: projects } = api.project.list.useQuery(undefined, { enabled: editing });

  function handleSave() {
    const t = title.trim();
    if (!t) return;
    onUpdate({
      id: task.id,
      title: t,
      notes: notes.trim() || null,
      dueDate: dueDate ? new Date(dueDate + "T12:00:00Z").toISOString() : null,
      priority: (priority as "high" | "medium" | "low") || null,
      status: status as "todo" | "in_progress" | "blocked" | "done",
      blockedNote: status === "blocked" ? (blockedNote.trim() || null) : null,
      projectId: projectId || null,
    });
    setEditing(false);
  }

  function handleCancel() {
    setTitle(task.title);
    setNotes(task.notes ?? "");
    setDueDate(dueDateRaw);
    setPriority(task.priority ?? "");
    setStatus(task.status || "todo");
    setBlockedNote(task.blockedNote ?? "");
    setProjectId(task.projectId ?? "");
    setEditing(false);
  }

  function handleStatusChange(newStatus: string) {
    if (newStatus === "blocked") {
      setShowBlockedNoteInput(true);
      setQuickBlockedNote(task.blockedNote ?? "");
      return;
    }
    setShowBlockedNoteInput(false);
    onUpdate({ id: task.id, status: newStatus as "todo" | "in_progress" | "blocked" | "done", blockedNote: null });
  }

  function saveBlockedNote() {
    onUpdate({
      id: task.id,
      status: "blocked",
      blockedNote: quickBlockedNote.trim() || null,
    });
    setShowBlockedNoteInput(false);
  }

  if (editing) {
    return (
      <li className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4 shadow-lg">
        <div className="flex flex-col gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl border border-slate-600 bg-slate-800/50 px-3 py-2 text-slate-100 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
            aria-label="Task title"
            autoFocus
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú (tùy chọn)"
            rows={2}
            className="rounded-xl border border-slate-600 bg-slate-800/50 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
            aria-label="Task notes"
          />
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <span>Hạn</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded-xl border border-slate-600 bg-slate-800/50 px-2 py-1 text-slate-100 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
                aria-label="Due date"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <span>Ưu tiên</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="rounded-xl border border-slate-600 bg-slate-800/50 px-2 py-1 text-slate-100 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
                aria-label="Priority"
              >
                <option value="">Không</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <span>Trạng thái</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border border-slate-600 bg-slate-800/50 px-2 py-1 text-slate-100 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
                aria-label="Status"
              >
                <option value="todo">Cần làm</option>
                <option value="in_progress">Đang làm</option>
                <option value="blocked">Bị chặn</option>
                <option value="done">Xong</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <span>Dự án</span>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="rounded-xl border border-slate-600 bg-slate-800/50 px-2 py-1 text-slate-100 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
                aria-label="Project"
              >
                <option value="">Không</option>
                {projects?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {status === "blocked" && (
            <label className="flex flex-col gap-1 text-sm text-slate-400">
              <span>Lý do bị chặn</span>
              <input
                type="text"
                value={blockedNote}
                onChange={(e) => setBlockedNote(e.target.value)}
                placeholder="vd. đang chờ design"
                maxLength={500}
                className="rounded-xl border border-slate-600 bg-slate-800/50 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
                aria-label="Blocked note"
              />
            </label>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isUpdating || !title.trim()}
              className="rounded-xl bg-amber-500 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-amber-400 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUpdating}
              className="rounded-xl border border-slate-600 bg-slate-800/50 px-3 py-1.5 text-sm text-slate-200 hover:border-slate-500 hover:bg-slate-800 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Hủy
            </button>
          </div>
        </div>
      </li>
    );
  }

  const busy = isUpdating || isDeleting || isReordering;
  const statusStyle =
    task.status === "done"
      ? "bg-emerald-500/30 text-emerald-200"
      : task.status === "in_progress"
        ? "bg-sky-500/30 text-sky-200"
        : task.status === "blocked"
          ? "bg-red-500/30 text-red-200"
          : "bg-slate-600/50 text-slate-200";

  return (
    <li className="flex flex-col gap-1 rounded-2xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 shadow-lg">
      <div className="flex items-center gap-2">
        {showReorder && (
          <div className="flex shrink-0 flex-col gap-0">
            <button
              type="button"
              onClick={() => onReorder({ id: task.id, direction: "up" })}
              disabled={busy || index === 0}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              aria-label="Move task up"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => onReorder({ id: task.id, direction: "down" })}
              disabled={busy || index === total - 1}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              aria-label="Move task down"
            >
              ↓
            </button>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-slate-100">{task.title}</span>
            <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${statusStyle}`}>
              {STATUS_LABELS[task.status] ?? task.status}
            </span>
            {task.priority ? (
              <span
                className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                  task.priority === "high"
                    ? "bg-amber-500/30 text-amber-200"
                    : task.priority === "medium"
                      ? "bg-blue-500/30 text-blue-200"
                      : "bg-slate-600/50 text-slate-200"
                }`}
              >
                {PRIORITY_LABELS[task.priority] ?? task.priority}
              </span>
            ) : null}
            {task.dueDate ? (
              <span className="text-sm text-slate-400">{formatDueDate(task.dueDate)}</span>
            ) : null}
            {task.project ? (
              <span className="rounded bg-slate-600/50 px-1.5 py-0.5 text-xs text-slate-200">
                {task.project.name}
              </span>
            ) : null}
          </div>
          {task.notes ? (
            <p className="mt-0.5 text-sm text-slate-400">{task.notes}</p>
          ) : null}
          {task.status === "blocked" && task.blockedNote ? (
            <p className="mt-0.5 text-sm text-red-300">Bị chặn: {task.blockedNote}</p>
          ) : null}
          {showBlockedNoteInput && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={quickBlockedNote}
                onChange={(e) => setQuickBlockedNote(e.target.value)}
                placeholder="Lý do bị chặn? (tùy chọn)"
                maxLength={500}
                className="max-w-xs flex-1 rounded-xl border border-slate-600 bg-slate-800/50 px-2 py-1 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
                aria-label="Blocked note"
                onKeyDown={(e) => e.key === "Enter" && saveBlockedNote()}
              />
              <button
                type="button"
                onClick={saveBlockedNote}
                disabled={isUpdating}
                className="rounded-xl bg-amber-500 px-2 py-1 text-sm text-slate-900 hover:bg-amber-400 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => setShowBlockedNoteInput(false)}
                className="rounded-xl border border-slate-600 bg-slate-800/50 px-2 py-1 text-sm text-slate-300 hover:border-slate-500 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={busy}
            className="rounded-xl border border-slate-600 bg-slate-800/50 px-2 py-1 text-xs text-slate-100 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 disabled:opacity-50"
            aria-label="Change status"
          >
            <option value="todo">Cần làm</option>
            <option value="in_progress">Đang làm</option>
            <option value="blocked">Bị chặn</option>
            <option value="done">Xong</option>
          </select>
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={busy}
            className="rounded-xl border border-slate-600 bg-slate-800/50 px-2 py-1 text-sm text-slate-300 hover:border-slate-500 hover:bg-slate-800 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            aria-label={`Edit task: ${task.title}`}
          >
            Sửa
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.confirm("Bạn có chắc muốn xóa task này?")) {
                onDelete({ id: task.id });
              }
            }}
            disabled={isDeleting}
            className="rounded-xl px-2 py-1 text-sm text-red-400 hover:bg-red-500/20 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            aria-label={`Delete task: ${task.title}`}
          >
            Xóa
          </button>
        </div>
      </div>
    </li>
  );
}
