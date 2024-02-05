import { v } from "convex/values";

import { query } from "./_generated/server";

/**
 * @description Get all boards for an organization
 * @params {string} orgId
 */
export const get = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return ctx.db
      .query("boards")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .collect();
  },
});
