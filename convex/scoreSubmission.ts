import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Status } from "./status";

export const createScoreSubmission = mutation({
    args: {
        teamId: v.id("team"),
        playerId: v.id("player"),
        score: v.number(),
        rejectedReason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const DEFAULT_STATUS: "valid" | "rejected" = "valid";
        const submissionId = await ctx.db.insert("scoreSubmission", {
            teamId: args.teamId,
            playerId: args.playerId,
            score: args.score,
            status: DEFAULT_STATUS,
            rejectedReason: args.rejectedReason,
            timestamp: Date.now(),
        });

        return await ctx.db.get("scoreSubmission", submissionId);
    },
});

export const getScoreSubmission = query({
    args: {
        submissionId: v.id("scoreSubmission"),
    },
    handler: async (ctx, args) => {
        const submission = await ctx.db.get("scoreSubmission", args.submissionId);
        if (submission == null) return Status.NOT_FOUND;

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
        if (submission == null) return Status.NOT_FOUND;

        await ctx.db.patch("scoreSubmission", args.submissionId, {
            status: args.status,
            rejectedReason: args.rejectedReason,
        });

        return Status.OK;
    },
});

export const deleteScoreSubmission = mutation({
    args: {
        submissionId: v.id("scoreSubmission"),
    },
    handler: async (ctx, args) => {
        const submission = await ctx.db.get("scoreSubmission", args.submissionId);
        if (submission == null) return Status.NOT_FOUND;

        await ctx.db.delete("scoreSubmission", args.submissionId);
        return Status.OK;
    },
});
