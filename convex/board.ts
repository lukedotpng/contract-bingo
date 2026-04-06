import { query } from "./_generated/server"
import { mutation } from "./_generated/server"
import { v } from "convex/values"
import { Status } from "./status";
import Rand from "rand-seed";

export const createBoard = mutation({
    args: {
        boardSize: v.union(
            v.literal("4x4"),
            v.literal("5x5"),
        ),
    },
    handler: async (ctx, args) => {
        const rand = new Rand();
        const board = await ctx.db.insert("board", {
            boardSize: args.boardSize,
            seed: rand.next(),
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
        if (board == null) return Status.NOT_FOUND;

        return board;
    },
});

export const deleteBoard = mutation({
    args: {
        boardId: v.id("board"),
    },
    handler: async (ctx, args) => {
        const board = await ctx.db.get("board", args.boardId);
        if (board == null) return Status.NOT_FOUND;

        await ctx.db.delete("board", args.boardId);
        return Status.OK;
    },
});

export const addBoardToContract = mutation({
    args: {
        boardId: v.id("board"),
        btcId: v.id("boardToContract"),
    },
    handler: async (ctx, args) => {
        const board = await ctx.db.get("board", args.boardId);
        if (board == null) return Status.NOT_FOUND;

        const btc = await ctx.db.get("boardToContract", args.btcId);
        if (btc == null) return Status.NOT_FOUND;

        if (board.boardToContracts == null) board.boardToContracts = [];
        if (board.boardToContracts.includes(args.btcId)) return Status.BAD_REQUEST;

        board.boardToContracts.push(args.btcId);
        await ctx.db.patch("board", args.boardId, {
            boardToContracts: board.boardToContracts,
        });

        return board.boardToContracts;
    },
});
