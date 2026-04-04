import { time, timeStamp } from "console";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createScoreSubmission = mutation({
    args: {
        teamId: v.id("team"),
        playerId: v.id("player"),
        score: v.number(),
        rejectedReason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const DEFAULT_STATUS: "valid" | "rejected" = "valid";
        return await ctx.db.insert("scoreSubmission", {
            teamId: args.teamId,
            playerId: args.playerId,
            score: args.score,
            status: DEFAULT_STATUS,
            rejectedReason: args.rejectedReason,
            timestamp: Date.now(),
        });
    },
});

export const getScoreSubmission = query({
    args: {
        submissionId: v.id("scoreSubmission"),
    },
    handler: async (ctx, args) => {
        const submission = await ctx.db.get("scoreSubmission", args.submissionId);
        return submission;
    },
})

export const updateScoreSubmissionStatus = mutation({
    args: {
        submissionId: v.id("scoreSubmission"),
        status: v.union(
            v.literal("valid"),
            v.literal("rejected"),
        ),
        rejectedReason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const submission = await ctx.db.get("scoreSubmission", args.submissionId);
        if (submission == null) return null;

        await ctx.db.patch("scoreSubmission", args.submissionId, {
            status: args.status,
            rejectedReason: args.rejectedReason,
        });
    },
});

export const deleteScoreSubmission = mutation({
    args: {
        submissionId: v.id("scoreSubmission"),
    },
    handler: async (ctx, args) => {
        const submission = await ctx.db.get("scoreSubmission", args.submissionId);
        if (submission == null) return;

        await ctx.db.delete("scoreSubmission", args.submissionId);
    },
});
