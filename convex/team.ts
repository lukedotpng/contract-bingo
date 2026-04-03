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
