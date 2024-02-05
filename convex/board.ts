import { v } from "convex/values";

import { mutation } from "./_generated/server";

const images = Array(10)
  .fill("/placeholders/")
  .map((path, i) => `${path}${i + 1}.svg`);

/**
 * @description Create a new board
 * @params {string} title
 * @params {string} orgId
 */
export const create = mutation({
  args: {
    title: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const randomImage = images[Math.floor(Math.random() * images.length)];
    // create a new board
    return await ctx.db.insert("boards", {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });
  },
});
