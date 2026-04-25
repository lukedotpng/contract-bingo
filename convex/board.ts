import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { ResponseStatus } from "@/lib/globals";
import { GenerateSeed } from "@/lib/BoardUtils";

export const createBoard = mutation({
    args: {
        boardSize: v.union(
            v.literal("4x4"),
            v.literal("5x5"),
        ),
    },
    handler: async (ctx, args) => {
        const board = await ctx.db.insert("board", {
            boardSize: args.boardSize,
            seed: GenerateSeed(15),
        });

        return await ctx.db.get("board", board);
    },
});

export const getBoard = query({
    args: {
        boardId: v.id("board"),
    },
    handler: async (ctx, args) => {
        const board = await ctx.db.get("board", args.boardId);
        if (board == null) return ResponseStatus.NOT_FOUND;

        return board;
    },
});

export const deleteBoard = mutation({
    args: {
        boardId: v.id("board"),
    },
    handler: async (ctx, args) => {
        const board = await ctx.db.get("board", args.boardId);
        if (board == null) return ResponseStatus.NOT_FOUND;

        await ctx.db.delete("board", args.boardId);
        return ResponseStatus.OK;
    },
});

export const generateNewSeed = mutation({
    args: {
        boardId: v.id("board"),
    },
    handler: async (ctx, args) => {
        const board = await ctx.db.get(args.boardId);
        if (board == null) return ResponseStatus.NOT_FOUND;

        await ctx.db.patch("board", args.boardId, {
            seed: GenerateSeed(15),
        });
    },
});
