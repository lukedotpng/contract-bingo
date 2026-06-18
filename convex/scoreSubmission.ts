import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { ResponseStatus } from "@/lib/globals";

export const createScoreSubmission = mutation({
    args: {
        matchId: v.id("match"),
        teamId: v.id("team"),
        playerId: v.id("player"),
        contractId: v.id("contract"),
        playerUsername: v.string(),
        seconds: v.number(),
        score: v.number(),
        timestamp: v.number(),
        rejectedReason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const DEFAULT_STATUS: "valid" | "rejected" = "valid";
        const submissionId = await ctx.db.insert("scoreSubmission", {
            matchId: args.matchId,
            teamId: args.teamId,
            playerId: args.playerId,
            contractId: args.contractId,
            playerUsername: args.playerUsername,
            seconds: args.seconds,
            score: args.score,
            status: DEFAULT_STATUS,
            rejectedReason: args.rejectedReason,
            timestamp: args.timestamp,
        });

        return await ctx.db.get("scoreSubmission", submissionId);
    },
});

export const getScoreSubmission = query({
    args: {
        submissionId: v.id("scoreSubmission"),
    },
    handler: async (ctx, args) => {
        const submission = await ctx.db.get(
            "scoreSubmission",
            args.submissionId,
        );
        if (submission == null) return ResponseStatus.NOT_FOUND;

        return submission;
    },
});

export const getMatchScoreSubmissions = query({
    args: {
        matchId: v.id("match"),
    },
    handler: async (ctx, args) => {
        const submissions = ctx.db
            .query("scoreSubmission")
            .withIndex("seconds")
            .filter((q) => q.eq(q.field("matchId"), args.matchId))
            .collect();

        return submissions;
    },
});

export const updateScoreSubmissionResponseStatus = mutation({
    args: {
        submissionId: v.id("scoreSubmission"),
        status: v.union(v.literal("valid"), v.literal("rejected")),
        rejectedReason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const submission = await ctx.db.get(
            "scoreSubmission",
            args.submissionId,
        );
        if (submission == null) return ResponseStatus.NOT_FOUND;

        await ctx.db.patch("scoreSubmission", args.submissionId, {
            status: args.status,
            rejectedReason: args.rejectedReason,
        });

        return ResponseStatus.OK;
    },
});

export const deleteScoreSubmission = mutation({
    args: {
        submissionId: v.id("scoreSubmission"),
    },
    handler: async (ctx, args) => {
        const submission = await ctx.db.get(
            "scoreSubmission",
            args.submissionId,
        );
        if (submission == null) return ResponseStatus.NOT_FOUND;

        await ctx.db.delete("scoreSubmission", args.submissionId);
        return ResponseStatus.OK;
    },
});
