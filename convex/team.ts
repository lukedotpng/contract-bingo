import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const createTeams = mutation({
    args: {
        quantity: v.number(),
    },
    handler: async (ctx, args) => {
        const teamIds: Id<"team">[] = [];
        for (let i = 0; i < args.quantity; i++) {
            const randColor = crypto.getRandomValues(new Uint8Array(6)).buffer;
            teamIds.push(await ctx.db.insert("team", {
                color: randColor,
            }));
        }
        return teamIds;
    },
});

export const getTeam = query({
    args: {
        teamId: v.id("team"),
    },
    handler: async (ctx, args) => {
        const team = await ctx.db.get("team", args.teamId);
        return team;
    },
});

export const addPlayerToTeam = mutation({
    args: {
        teamId: v.id("team"),
        playerId: v.id("player"),
    },
    handler: async (ctx, args) => {
        const team = await ctx.db.get("team", args.teamId);
        if (team == null) return "team doesn't exist with given teamId";

        const player = await ctx.db.get("player", args.playerId);
        if (player == null) return "player doesn't exist with given playerId";

        if (team.playerIds == null) team.playerIds = [];
        if (team.playerIds.includes(args.playerId)) return "player already exists within the given team";

        team.playerIds.push(args.playerId);
        await ctx.db.patch("team", args.teamId, {
            playerIds: team.playerIds,
        })
    },
});

export const deleteTeam = mutation({
    args: {
        teamId: v.id("team"),
    },
    handler: async (ctx, args) => {
        const team = await ctx.db.get("team", args.teamId);
        if (team == null) return null;

        await ctx.db.delete("team", args.teamId);
    },
});
