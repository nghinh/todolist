import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const prioritySchema = z.enum(["high", "medium", "low"]).optional().nullable();
const statusSchema = z.enum(["todo", "in_progress", "blocked", "done"]).optional();

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        notes: z.string().optional(),
        dueDate: z.string().datetime().optional().nullable(),
        priority: prioritySchema,
        status: statusSchema,
        projectId: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const count = await ctx.db.task.count({
        where: { userId: ctx.session.user.id },
      });
      return ctx.db.task.create({
        data: {
          userId: ctx.session.user.id,
          title: input.title,
          notes: input.notes ?? null,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          priority: input.priority ?? null,
          status: input.status ?? "todo",
          sortOrder: count,
          projectId: input.projectId ?? null,
        },
      });
    }),

  getMyTasks: protectedProcedure
    .input(
      z
        .object({
          projectId: z.string().optional().nullable(),
          orderBy: z.enum(["sortOrder", "dueDate"]).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where = { userId: ctx.session.user.id } as { userId: string; projectId?: string | null };
      if (input?.projectId !== undefined && input.projectId !== null && input.projectId !== "") {
        where.projectId = input.projectId;
      }
      const orderBy =
        input?.orderBy === "dueDate"
          ? ([{ dueDate: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] as const)
          : ([{ sortOrder: "asc" }, { createdAt: "asc" }] as const);
      return ctx.db.task.findMany({
        where,
        orderBy,
        include: { project: true },
      });
    }),

  /** Tasks relevant for "today" view: due today, overdue, or no due date. Ordered: overdue first, then by due date, then sortOrder. */
  getTodayTasks: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000 - 1);
    return ctx.db.task.findMany({
      where: {
        userId: ctx.session.user.id,
        OR: [{ dueDate: null }, { dueDate: { lte: endOfToday } }],
      },
      orderBy: [{ dueDate: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      include: { project: true },
    });
  }),

  getOverdueTasks: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    return ctx.db.task.findMany({
      where: {
        userId: ctx.session.user.id,
        dueDate: { lt: startOfToday },
      },
      orderBy: [{ dueDate: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      include: { project: true },
    });
  }),

  getUpcomingTasks: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const startOfTomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    return ctx.db.task.findMany({
      where: {
        userId: ctx.session.user.id,
        dueDate: { gte: startOfTomorrow },
      },
      orderBy: [{ dueDate: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      include: { project: true },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.db.task.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
      return task ?? null;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        notes: z.string().nullable().optional(),
        dueDate: z.string().datetime().optional().nullable(),
        priority: prioritySchema,
        status: statusSchema,
        blockedNote: z.string().max(500).optional().nullable(),
        projectId: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, dueDate, ...rest } = input;
      const task = await ctx.db.task.findFirst({
        where: { id, userId: ctx.session.user.id },
      });
      if (!task) return { count: 0 };
      const data: {
        title?: string;
        notes?: string | null;
        dueDate?: Date | null;
        priority?: string | null;
        status?: string;
        blockedNote?: string | null;
        projectId?: string | null;
      } = { ...rest };
      if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
      return ctx.db.task.update({
        where: { id },
        data,
      });
    }),

  reorder: protectedProcedure
    .input(z.object({ id: z.string(), direction: z.enum(["up", "down"]) }))
    .mutation(async ({ ctx, input }) => {
      const tasks = await ctx.db.task.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      const idx = tasks.findIndex((t) => t.id === input.id);
      if (idx < 0) return tasks;
      const swapIdx = input.direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= tasks.length) return tasks;
      const [a, b] = [tasks[idx]!.sortOrder, tasks[swapIdx]!.sortOrder];
      await ctx.db.task.updateMany({
        where: { id: input.id, userId: ctx.session.user.id },
        data: { sortOrder: b },
      });
      await ctx.db.task.updateMany({
        where: { id: tasks[swapIdx]!.id, userId: ctx.session.user.id },
        data: { sortOrder: a },
      });
      return ctx.db.task.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: { project: true },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.task.deleteMany({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      return result;
    }),
});
