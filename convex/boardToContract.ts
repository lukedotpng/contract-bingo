import { Id } from "./_generated/dataModel";
import { MutationCtx, query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

async function boardContainsContract(ctx: MutationCtx, boardId: Id<"board">, contractId: Id<"contract">): Promise<boolean> {
    const existingBTC = await ctx.db
        .query("boardToContract")
        .withIndex("byBoardContract", (q) => q.eq("boardId", boardId).eq("contractId", contractId))
        .collect();
    if (existingBTC.length > 0) return true;

    return false;
}

export const createBoardToContract = mutation({
    args: {
        boardId: v.id("board"),
        contractId: v.id("contract"),
    },
    handler: async (ctx, args) => {
        const boardId = await ctx.db.get("board", args.boardId);
        if (boardId == null) return "board doesn't exist with given boardId";

        const contractId = await ctx.db.get("contract", args.contractId);
        if (contractId == null) return "contract doesn't exist with given contractId";

        if (await boardContainsContract(ctx, args.boardId, args.contractId)) return "contractId already associated with boardId";

        return await ctx.db.insert("boardToContract", {
            boardId: args.boardId,
            contractId: args.contractId,
        });
    },
});

export const getBoardToContract = query({
    args: {
        btcId: v.id("boardToContract"),
    },
    handler: async (ctx, args) => {
        const btc = await ctx.db.get("boardToContract", args.btcId);
        if (btc == null) return "boardToContract doesn't exist with given boardToContractId";

        return btc;
    },
});

export const addBoardToContractSubmission = mutation({
    args: {
        btcId: v.id("boardToContract"),
        submissionId: v.id("scoreSubmission"),
    },
    handler: async (ctx, args) => {
        const btc = await ctx.db.get("boardToContract", args.btcId);
        if (btc == null) return "boardToContract doesn't exist with given boardToContractId";

        const submission = await ctx.db.get("scoreSubmission", args.submissionId);
        if (submission == null) return "submission doesn't exist with given submissionId";

        if (btc.submissionIds == null) btc.submissionIds = [];

        btc.submissionIds.push(args.submissionId);

        return await ctx.db.patch("boardToContract", args.btcId, {
            submissionIds: btc.submissionIds,
        });
    },
});

export const removeBoardToContractSubmission = mutation({
    args: {
        btcId: v.id("boardToContract"),
        submissionId: v.id("scoreSubmission"),
    },
    handler: async (ctx, args) => {
        const btc = await ctx.db.get("boardToContract", args.btcId);
        if (btc == null) return "boardToContract doesn't exist with given boardToContractId";

        const submission = await ctx.db.get("scoreSubmission", args.submissionId);
        if (submission == null) return "submission doesn't exist with given submissionId";

        if (btc.submissionIds == null) return "boardToContract doesn't have any submissions";

        if (!btc.submissionIds.includes(args.submissionId)) return "submissionId doesn't exist in boardToContract submissions";

        const submissionIndex = btc.submissionIds.indexOf(args.submissionId);
        delete btc.submissionIds[submissionIndex];

        return await ctx.db.patch("boardToContract", args.btcId, {
            submissionIds: btc.submissionIds,
        })
    },
});

export const deleteBoardToContract = mutation({
    args: {
        btcId: v.id("boardToContract"),
    },
    handler: async (ctx, args) => {
        const btc = await ctx.db.get("boardToContract", args.btcId);
        if (btc == null) return "boardToContract doesn't exist with given boardToContractId";

        await ctx.db.delete("boardToContract", args.btcId);
    },
});
