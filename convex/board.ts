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
