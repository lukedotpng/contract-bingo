import { Id } from "./_generated/dataModel";
import { MutationCtx, query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { ResponseStatus } from "@/lib/globals";

async function boardContainsContract(
    ctx: MutationCtx,
    boardId: Id<"board">,
    contractId: Id<"contract">,
): Promise<boolean> {
    const existingBTC = await ctx.db
        .query("boardToContract")
        .withIndex("byBoardContract", (q) =>
            q.eq("boardId", boardId).eq("contractId", contractId),
        )
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
        if (boardId == null) return ResponseStatus.NOT_FOUND;

        const contractId = await ctx.db.get("contract", args.contractId);
        if (contractId == null) return ResponseStatus.NOT_FOUND;

        if (await boardContainsContract(ctx, args.boardId, args.contractId))
            return ResponseStatus.BAD_REQUEST;

        const btcId = await ctx.db.insert("boardToContract", {
            boardId: args.boardId,
            contractId: args.contractId,
        });

        return await ctx.db.get("boardToContract", btcId);
    },
});

export const getBoardToContract = query({
    args: {
        btcId: v.id("boardToContract"),
    },
    handler: async (ctx, args) => {
        const btc = await ctx.db.get("boardToContract", args.btcId);
        if (btc == null) return ResponseStatus.NOT_FOUND;

        return btc;
    },
});

export const getAllContractsFromBoard = query({
    args: {
        boardId: v.id("board"),
    },
    handler: async (ctx, args) => {
        const boardToContracts = await ctx.db
            .query("boardToContract")
            .withIndex("byBoardContract", (q) => q.eq("boardId", args.boardId))
            .collect();

        const contractIds = boardToContracts.map(
            (boardToContracts) => boardToContracts.contractId,
        );

        const contracts = await Promise.all(
            contractIds.map((id) => ctx.db.get("contract", id)),
        );
        return contracts.filter((contract) => contract !== null);
    },
});

export const getAllBTCsFromBoard = query({
    args: {
        boardId: v.id("board"),
    },
    handler: async (ctx, args) => {
        const board = await ctx.db.get("board", args.boardId);
        if (board == null) return ResponseStatus.NOT_FOUND;

        return await ctx.db
            .query("boardToContract")
            .withIndex("byBoardContract", (q) => q.eq("boardId", args.boardId))
            .collect();
    },
});

export const addBoardToContractSubmission = mutation({
    args: {
        btcId: v.id("boardToContract"),
        submissionId: v.id("scoreSubmission"),
    },
    handler: async (ctx, args) => {
        const btc = await ctx.db.get("boardToContract", args.btcId);
        if (btc == null) return ResponseStatus.NOT_FOUND;

        const submission = await ctx.db.get(
            "scoreSubmission",
            args.submissionId,
        );
        if (submission == null) return ResponseStatus.NOT_FOUND;

        if (btc.submissionIds == null) btc.submissionIds = [];
        if (btc.submissionIds.includes(args.submissionId))
            return ResponseStatus.BAD_REQUEST;

        btc.submissionIds.push(args.submissionId);

        await ctx.db.patch("boardToContract", args.btcId, {
            submissionIds: btc.submissionIds,
        });

        return ResponseStatus.OK;
    },
});

export const removeBoardToContractSubmission = mutation({
    args: {
        btcId: v.id("boardToContract"),
        submissionId: v.id("scoreSubmission"),
    },
    handler: async (ctx, args) => {
        const btc = await ctx.db.get("boardToContract", args.btcId);
        if (btc == null) return ResponseStatus.NOT_FOUND;

        const submission = await ctx.db.get(
            "scoreSubmission",
            args.submissionId,
        );
        if (submission == null) return ResponseStatus.NOT_FOUND;

        if (btc.submissionIds == null)
            return "boardToContract doesn't have any submissions";

        if (
            btc.submissionIds == null ||
            !btc.submissionIds.includes(args.submissionId)
        )
            return ResponseStatus.BAD_REQUEST;

        const submissionIndex = btc.submissionIds.indexOf(args.submissionId);
        delete btc.submissionIds[submissionIndex];

        await ctx.db.patch("boardToContract", args.btcId, {
            submissionIds: btc.submissionIds,
        });

        return ResponseStatus.OK;
    },
});

export const deleteBoardToContract = mutation({
    args: {
        btcId: v.id("boardToContract"),
    },
    handler: async (ctx, args) => {
        const btc = await ctx.db.get("boardToContract", args.btcId);
        if (btc == null) return ResponseStatus.NOT_FOUND;

        await ctx.db.delete("boardToContract", args.btcId);
        return ResponseStatus.OK;
    },
});
