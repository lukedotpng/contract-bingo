import { isNull } from "util";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { BADQUERY } from "dns";

export const createContract = mutation({
    args: {
        epicId: v.optional(v.string()),
        steamId: v.optional(v.string()),
        xboxId: v.optional(v.string()),
        playstationId: v.optional(v.string()),
        switchId: v.optional(v.string()),
        location: v.union(
            v.literal("freeform_training"),
            v.literal("the_final_test"),
            v.literal("the_showstopper"),
            v.literal("world_of_tomorrow"),
            v.literal("a_gilded_cage"),
            v.literal("club_27"),
            v.literal("freedom_fighters"),
            v.literal("situs_inversus"),
            v.literal("nightcall"),
            v.literal("the_finish_line"),
            v.literal("three-headed_serpent"),
            v.literal("chasing_a_ghost"),
            v.literal("another_life"),
            v.literal("shadows_in_the_water"),
            v.literal("the_ark_society"),
            v.literal("golden_handshake"),
            v.literal("the_last_resort"),
            v.literal("on_top_of_the_world"),
            v.literal("death_in_the_family"),
            v.literal("apex_predator"),
            v.literal("end_of_an_era"),
            v.literal("the_farewell"),
            v.literal("holiday_hoarders"),
            v.literal("landslide"),
            v.literal("the_icon"),
            v.literal("the_author"),
            v.literal("a_house_built_on_sand"),
            v.literal("the_source"),
            v.literal("patient_zero"),
            v.literal("hokkaido_snow_festival"),
            v.literal("the_dartmoor_garden_show"),
        ),
    },
    handler: async (ctx, args) => {
        // ensure at least one id exists
        if (
            args.epicId == null &&
            args.steamId == null &&
            args.xboxId == null &&
            args.playstationId == null &&
            args.switchId == null
        ) return null;

        return await ctx.db.insert("contract", {
            epicId: args.epicId,
            steamId: args.steamId,
            xboxId: args.xboxId,
            playstationId: args.playstationId,
            switchId: args.switchId,
            location: args.location,
        });
    },
});

export const deleteContract = mutation({
    args: {
        contractId: v.id("contract"),
    },
    handler: async (ctx, args) => {
        const contract = await ctx.db.get("contract", args.contractId);
        if (contract == null) return;

        await ctx.db.delete("contract", args.contractId);
    }
});
