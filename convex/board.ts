import { query } from "./_generated/server"
import { mutation } from "./_generated/server"
import { v } from "convex/values"
import Rand from "rand-seed";

export const createBoard = mutation({
    args: {
        boardSize: v.union(
            v.literal("4x4"),
            v.literal("5x5"),
        ),
    },
    returns: v.id("board"),
    handler: async (ctx, args) => {
        const rand = new Rand();
        return await ctx.db.insert("board", {
            boardSize: args.boardSize,
            seed: rand.next(),
        });
    },
});

export const getBoard = query({
    args: {
        boardId: v.id("board"),
    },
    handler: async (ctx, args) => {
        const board = await ctx.db.get("board", args.boardId);
        if (board == null) return null;

        return board;
    },
});

export const deleteBoard = mutation({
    args: {
        boardId: v.id("board"),
    },
    handler: async (ctx, args) => {
        const board = await ctx.db.get("board", args.boardId)
        if (board == null) return null;

        await ctx.db.delete("board", args.boardId);
    },
});
