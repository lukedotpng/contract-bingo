type Contract = {
    id: string;
    location: ContractLocation;
    epicId?: string;
    steamId?: string;
    xboxId?: string;
    playstationId?: string;
    switchId?: string;
};

type ContractLocation =
    | "freeform_training"
    | "the_final_test"
    | "the_showstopper"
    | "world_of_tomorrow"
    | "a_gilded_cage"
    | "club_27"
    | "freedom_fighters"
    | "situs_inversus"
    | "nightcall"
    | "the_finish_line"
    | "three-headed_serpent"
    | "chasing_a_ghost"
    | "another_life"
    | "shadows_in_the_water"
    | "the_ark_society"
    | "golden_handshake"
    | "the_last_resort"
    | "on_top_of_the_world"
    | "death_in_the_family"
    | "apex_predator"
    | "end_of_an_era"
    | "the_farewell"
    | "holiday_hoarders"
    | "landslide"
    | "the_icon"
    | "the_author"
    | "a_house_built_on_sand"
    | "the_source"
    | "patient_zero"
    | "hokkaido_snow_festival"
    | "the_dartmoor_garden_show";
