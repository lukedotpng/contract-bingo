import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createMatch = mutation({
    args: {
        startTime: v.int64(),
        gracePeriodLength: v.number(),
        boardId: v.id("board"),
        teamIds: v.array(v.id("team")),
    },
    returns: v.id("match"),
    handler: async (ctx, args) => {
        return await ctx.db.insert("match", {
            teamCount: args.teamIds.length,
            startTime: args.startTime,
            gracePeriodLength: args.gracePeriodLength,
            status: "scheduled",
            teamIds: args.teamIds,
            boardId: args.boardId,
        });
    },
});

export const getMatches = query({
    handler: async (ctx, _) => {
        const boards = ctx.db.query("match").collect();
        return boards;
    },
});

export const getMatch = query({
    args: {
        matchId: v.id("match"),
    },
    handler: async (ctx, args) => {
        const match = await ctx.db.get("match", args.matchId);
        return match;
    },
});

export const updateMatchStatus = mutation({
    args: {
        matchId: v.id("match"),
        status: v.union(
            v.literal("pending"),
            v.literal("scheduled"),
            v.literal("active"),
            v.literal("finished"),
        ),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const match = await ctx.db.get("match", args.matchId);
        if (match == null) return;

        match.status = args.status;
        await ctx.db.patch("match", args.matchId, match);
    },
});

export const deleteMatch = mutation({
    args: {
        matchId: v.id("match"),
    },
    handler: async (ctx, args) => {
        const match = await ctx.db.get("match", args.matchId);
        if (match == null) return;
        await ctx.db.delete("match", args.matchId);
    },

});
