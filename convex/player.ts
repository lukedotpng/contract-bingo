import { query } from "./_generated/server"
import { mutation } from "./_generated/server"
import { v } from "convex/values"
import { Status } from "./status";

export const createPlayer = mutation({
    args: {
        username: v.string(),
        platform: v.optional(v.union(
            v.literal("Epic"),
            v.literal("Steam"),
            v.literal("Playstation"),
            v.literal("Xbox"),
            v.literal("Nintendo Switch"),
        )),
    },
    handler: async (ctx, args) => {
        const playerId = await ctx.db.insert("player", {
            username: args.username,
            platform: args.platform,
        });

        return await ctx.db.get("player", playerId);
    },
});

export const getPlayer = query({
    args: {
        playerId: v.id("player"),
    },
    handler: async (ctx, args) => {
        const player = await ctx.db.get("player", args.playerId);
        if (player == null) return Status.NOT_FOUND;

        return player;
    },
});

export const updatePlayer = mutation({
    args: {
        playerId: v.id("player"),
        username: v.string(),
        platform: v.optional(v.union(
            v.literal("Epic"),
            v.literal("Steam"),
            v.literal("Playstation"),
            v.literal("Xbox"),
            v.literal("Nintendo Switch"),
        )),
    },
    handler: async (ctx, args) => {
        const player = await ctx.db.get("player", args.playerId);
        if (player == null) return Status.NOT_FOUND;

        await ctx.db.patch("player", args.playerId, {
            username: args.username,
            platform: args.platform,
        });

        return Status.OK;
    },
});

export const deletePlayer = mutation({
    args: {
        playerId: v.id("player"),
    },
    handler: async (ctx, args) => {
        const player = await ctx.db.get("player", args.playerId);
        if (player == null) return Status.NOT_FOUND;

        await ctx.db.delete("player", args.playerId);
        return Status.OK;
    },
});
