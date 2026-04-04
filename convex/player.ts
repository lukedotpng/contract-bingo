import { query } from "./_generated/server"
import { mutation } from "./_generated/server"
import { v } from "convex/values"

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
        return await ctx.db.insert("player", {
            username: args.username,
            platform: args.platform,
        });
    },
});

export const getPlayer = query({
    args: {
        playerId: v.id("player"),
    },
    handler: async (ctx, args) => {
        const player = await ctx.db.get("player", args.playerId);
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
        if (player == null) return null;

        player.username = args.username;
        player.platform = args.platform;

        await ctx.db.patch("player", args.playerId, player);
        return player;
    },
});

export const deletePlayer = mutation({
    args: {
        playerId: v.id("player"),
    },
    handler: async (ctx, args) => {
        const player = await ctx.db.get("player", args.playerId);
        if (player == null) return;

        await ctx.db.delete("player", args.playerId);
    },
});
