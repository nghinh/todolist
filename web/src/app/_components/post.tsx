"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
    },
  });

  return (
    <div className="flex w-full flex-col rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">Demo Post</h2>
      {latestPost ? (
        <p className="truncate text-slate-300">Bài gần nhất: {latestPost.name}</p>
      ) : (
        <p className="text-slate-400">Chưa có bài nào.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name });
        }}
        className="mt-4 flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Tiêu đề"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-slate-600 bg-slate-800/50 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
        />
        <button
          type="submit"
          className="w-fit rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold transition hover:border-slate-500 hover:bg-slate-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Đang gửi..." : "Gửi"}
        </button>
      </form>
    </div>
  );
}
