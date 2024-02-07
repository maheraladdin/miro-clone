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

export const remove = mutation({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // check if the board exists and the user is the author
    const board = await ctx.db.get(args.id);
    if (!board) throw new Error("Board not found");
    if (board.authorId !== identity.subject) throw new Error("Unauthorized");

    // TODO: Later Check for delete favorite relation as well.

    // remove a board
    return await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("boards"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const title = args.title.trim();
    if (!title) throw new Error("Title cannot be empty");
    if (title.length > 60)
      throw new Error("Title cannot be longer than 60 characters");

    // check if the board exists and the user is the author
    const board = await ctx.db.get(args.id);
    if (!board) throw new Error("Board not found");
    if (board.authorId !== identity.subject) throw new Error("Unauthorized");

    // update a board
    return await ctx.db.patch(args.id, { title });
  },
});
