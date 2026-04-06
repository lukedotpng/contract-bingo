import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { Status } from "./status";

export const createTeams = mutation({
    args: {
        quantity: v.number(),
    },
    handler: async (ctx, args) => {
        const teamIds: Id<"team">[] = [];
        const response = [];
        for (let i = 0; i < args.quantity; i++) {
            const randColor = crypto.getRandomValues(new Uint8Array(6)).buffer;
            const id: Id<"team"> = await ctx.db.insert("team", { color: randColor });
            teamIds.push(id);
            response.push(await ctx.db.get("team", id));
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
        if (team == null) return Status.NOT_FOUND;

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
        if (team == null) return Status.NOT_FOUND;

        const player = await ctx.db.get("player", args.playerId);
        if (player == null) return Status.NOT_FOUND;

        if (team.playerIds == null) team.playerIds = [];
        if (team.playerIds.includes(args.playerId)) return Status.BAD_REQUEST;

        team.playerIds.push(args.playerId);
        await ctx.db.patch("team", args.teamId, {
            playerIds: team.playerIds,
        });

        return Status.OK;
    },
});

export const deleteTeam = mutation({
    args: {
        teamId: v.id("team"),
    },
    handler: async (ctx, args) => {
        const team = await ctx.db.get("team", args.teamId);
        if (team == null) return Status.NOT_FOUND;

        await ctx.db.delete("team", args.teamId);
        return Status.OK;
    },
});
