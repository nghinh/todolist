import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const projectTypeSchema = z.enum(["project", "milestone", "goal"]).optional();

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), type: projectTypeSchema }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.create({
        data: {
          userId: ctx.session.user.id,
          name: input.name.trim(),
          type: input.type ?? "project",
        },
      });
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { name: "asc" },
    });
  }),
});
