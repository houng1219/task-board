import { schema } from "./_generated/server";
import { v } from "convex/server";

export default schema({
  tasks: v.object({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    ),
    assignee: v.union(v.literal("me"), v.literal("ai")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});
