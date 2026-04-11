import { MutationCtx, query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { ResponseStatus } from "@/lib/globals";
import { Id } from "./_generated/dataModel";

// Creates match, along with board and team ids in one mutation
export const createInitialMatch = mutation({
    args: {
        startTime: v.optional(v.number()),
        gracePeriodLength: v.number(),
        boardSize: v.union(v.literal("4x4"), v.literal("5x5")),
        teamCount: v.number(),
    },
    handler: async (ctx, args) => {
        const boardId = await createBoardForMatchHelper(ctx, args.boardSize);
        const teamIds = await createTeamIdsForMatchHelper(ctx, args.teamCount);
        const matchId = await createMatchHelper(ctx, 10, boardId, teamIds);
        return matchId;
    },
});

async function createBoardForMatchHelper(
    ctx: MutationCtx,
    boardSize: "4x4" | "5x5",
) {
    const boardId = await ctx.db.insert("board", {
        boardSize: boardSize,
        seed: Math.random(),
    });
    return boardId;
}

async function createTeamIdsForMatchHelper(
    ctx: MutationCtx,
    teamCount: number,
) {
    const teamIds: Id<"team">[] = [];
    for (let i = 0; i < teamCount; i++) {
        const randColor = crypto.getRandomValues(new Uint8Array(6)).buffer;
        const id: Id<"team"> = await ctx.db.insert("team", {
            color: randColor,
        });
        teamIds.push(id);
    }

    return teamIds;
}

async function createMatchHelper(
    ctx: MutationCtx,
    gracePeriodLength: number,
    boardId: Id<"board">,
    teamIds: Id<"team">[],
) {
    const match = await ctx.db.insert("match", {
        gracePeriodLength: gracePeriodLength,
        teamIds: teamIds,
        boardId: boardId,
        adminId: crypto.randomUUID(),
        status: "pending",
    });

    return match;
}

export const getMatches = query({
    handler: async (ctx, _) => {
        const boards = await ctx.db.query("match").collect();
        if (boards.length == 0) return ResponseStatus.NOT_FOUND;
        return boards;
    },
});

export const getMatch = query({
    args: {
        matchId: v.id("match"),
    },
    handler: async (ctx, args) => {
        const match = await ctx.db.get("match", args.matchId);
        if (match == null) return ResponseStatus.NOT_FOUND;
        return match;
    },
});

export const updateMatchResponseStatus = mutation({
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
        if (match == null) return ResponseStatus.NOT_FOUND;

        match.status = args.status;
        await ctx.db.patch("match", args.matchId, match);

        return ResponseStatus.OK;
    },
});

export const deleteMatch = mutation({
    args: {
        matchId: v.id("match"),
    },
    handler: async (ctx, args) => {
        const match = await ctx.db.get("match", args.matchId);
        if (match == null) return ResponseStatus.NOT_FOUND;
        await ctx.db.delete("match", args.matchId);

        return ResponseStatus.OK;
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
        if (match == null) return ResponseStatus.NOT_FOUND;

        return match.teamIds.map((teamId) => joinURI(args.matchId, teamId));
    },
});

export const getJoinURI = mutation({
    args: {
        matchId: v.id("match"),
        teamId: v.id("team"),
    },
    handler: async (ctx, args) => {
        const match = await ctx.db.get("match", args.matchId);
        if (match == null) return ResponseStatus.NOT_FOUND;

        const team = await ctx.db.get("team", args.teamId);
        if (team == null) return ResponseStatus.NOT_FOUND;

        return joinURI(args.matchId, args.teamId);
    },
});
