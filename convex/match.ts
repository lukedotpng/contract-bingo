import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Status } from "./status";
import { Id } from "./_generated/dataModel";

export const createMatch = mutation({
    args: {
        startTime: v.int64(),
        gracePeriodLength: v.number(),
        boardId: v.id("board"),
        teamIds: v.array(v.id("team")),
    },
    handler: async (ctx, args) => {
        const thingy = await ctx.db.insert("match", {
            teamCount: args.teamIds.length,
            startTime: args.startTime,
            gracePeriodLength: args.gracePeriodLength,
            status: "scheduled",
            teamIds: args.teamIds,
            boardId: args.boardId,
        });

        return await ctx.db.get("match", thingy);
    },
});

export const getMatches = query({
    handler: async (ctx, _) => {
        const boards = await ctx.db.query("match").collect();
        if (boards.length == 0) Status.NOT_FOUND;
        return boards;
    },
});

export const getMatch = query({
    args: {
        matchId: v.id("match"),
    },
    handler: async (ctx, args) => {
        const match = await ctx.db.get("match", args.matchId);
        if (match == null) return Status.NOT_FOUND;
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
    handler: async (ctx, args) => {
        const match = await ctx.db.get("match", args.matchId);
        if (match == null) return Status.NOT_FOUND;

        match.status = args.status;
        await ctx.db.patch("match", args.matchId, match);

        return Status.OK;
    },
});

export const deleteMatch = mutation({
    args: {
        matchId: v.id("match"),
    },
    handler: async (ctx, args) => {
        const match = await ctx.db.get("match", args.matchId);
        if (match == null) return Status.NOT_FOUND;
        await ctx.db.delete("match", args.matchId);

        return Status.OK;
    },
});

function joinURI(matchId: Id<"match">, teamId: Id<"team">): string {
    const BASE_JOIN_URI = "play";

    return `/${BASE_JOIN_URI}/${matchId}/${teamId}`;
}

export const getAllJoinURIs = query({
    args: {
        matchId: v.id("match"),
    },
    handler: async (ctx, args) => {
        const match = await ctx.db.get("match", args.matchId);
        if (match == null) return Status.NOT_FOUND;

        return match.teamIds.map(teamId => joinURI(args.matchId, teamId));
    },
});

export const getJoinURI = mutation({
    args: {
        matchId: v.id("match"),
        teamId: v.id("team"),
    },
    handler: async (ctx, args) => {
        const match = await ctx.db.get("match", args.matchId);
        if (match == null) return Status.NOT_FOUND;

        const team = await ctx.db.get("team", args.teamId);
        if (team == null) return Status.NOT_FOUND;

        return joinURI(args.matchId, args.teamId);
    },
});
