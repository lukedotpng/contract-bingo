import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ID and creation time fields automatic
export default defineSchema({
    match: defineTable({
        teamCount: v.number(),
        // Start time in Unix time
        startTime: v.int64(),
        gracePeriodLength: v.int64(),
        status: v.union(
            v.literal("pending"),
            v.literal("scheduled"),
            v.literal("active"),
            v.literal("finished"),
        ),
        teamIds: v.array(v.id("team")),
        boardId: v.id("board"),
    }).index("status", ["status"]),
    board: defineTable({
        boardSize: v.union(
            v.literal("4x4"),
            v.literal("5x5"),
        ),
        seed: v.int64(),
    }),
    contract: defineTable({
        // At least one contract ID always needed, enforced in app level
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
    }),
    boardToContract: defineTable({
        boardId: v.id("board"),
        contractId: v.id("contract"),
        submissionIds: v.array(v.id("scoreSubmission")),
    })
        .index("boardId", ["boardId"])
        .index("contractId", ["contractId"]),
    team: defineTable({
        color: v.string(),
        playerIds: v.nullable(v.array(v.id("player"))),
    }),
    scoreSubmission: defineTable({
        teamId: v.id("team"),
        playerId: v.id("player"),
        score: v.int64(),
        timestamp: v.int64(),
        status: v.union(v.literal("valid"), v.literal("rejected")),
        rejectedReason: v.optional(v.string()),
    })
        .index("playerId", ["playerId"])
        .index("timestamp", ["timestamp"])
        .index("status", ["status"]),
    player: defineTable({
        username: v.string(),
        platform: v.optional(v.union(
            v.literal("Epic"),
            v.literal("Steam"),
            v.literal("Playstation"),
            v.literal("Xbox"),
            v.literal("Nintendo Switch"),
        )),
    })
        .index("username", ["username"]),
});
