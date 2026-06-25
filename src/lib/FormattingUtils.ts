export function FormatContractLocation(location: ContractLocation) {
    const LocationFormatMap = new Map<ContractLocation, string>([
        ["freeform_training", "Freeform Training"],
        ["the_final_test", "The Final Test"],
        ["the_showstopper", "The Showstopper"],
        ["world_of_tomorrow", "World of Tomorrow"],
        ["a_gilded_cage", "A Gilded Cage"],
        ["club_27", "Club 27"],
        ["freedom_fighters", "Freedom Fighters"],
        ["situs_inversus", "Situs Inversus"],
        ["nightcall", "Nightcall"],
        ["the_finish_line", "The Finish Line"],
        ["three-headed_serpent", "Three-Headed Serpent"],
        ["chasing_a_ghost", "Chasing a Ghost"],
        ["another_life", "Another Life"],
        ["shadows_in_the_water", "Shadows In The Water"],
        ["the_ark_society", "The Ark Society"],
        ["golden_handshake", "Golden Handshake"],
        ["the_last_resort", "The Last Resort"],
        ["on_top_of_the_world", "On Top of the World"],
        ["death_in_the_family", "Death in the Family"],
        ["apex_predator", "Apex Predator"],
        ["end_of_an_era", "End of an Era"],
        ["the_farewell", "The Farewell"],
        ["holiday_hoarders", "Holiday Hoarders"],
        ["landslide", "Landslide"],
        ["the_icon", "The Icon"],
        ["the_author", "The Author"],
        ["a_house_built_on_sand", "A House Built on Sand"],
        ["the_source", "The Source"],
        ["patient_zero", "Patient Zero"],
        ["hokkaido_snow_festival", "Hokkaido Snow Festival"],
        ["the_dartmoor_garden_show", "The Dartmoor Garden Show"],
    ]);
    return LocationFormatMap.get(location);
}

export function SecondsToTimeString(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const secondsFixed = seconds.toFixed(3);

    const minutesString =
        minutes < 10 ? (minutes === 0 ? "00" : "0" + minutes) : minutes + "";
    const secondsString =
        seconds < 10
            ? seconds === 0
                ? "00.000"
                : "0" + secondsFixed
            : secondsFixed;

    return minutesString + ":" + secondsString;
}

export function MillisecondsToTimeString(totalMilliseconds: number) {
    const milliseconds = totalMilliseconds % 1000;
    const seconds = Math.floor(totalMilliseconds / 1000) % 60;
    const minutes = Math.floor(seconds / 60);

    const minutesString =
        minutes < 10 ? (minutes === 0 ? "00" : "0" + minutes) : minutes + "";
    const secondsString =
        seconds < 10 ? (seconds === 0 ? "00" : "0" + seconds) : seconds + "";
    const millisecondsString =
        milliseconds < 100
            ? milliseconds < 10
                ? milliseconds === 0
                    ? "000"
                    : "00" + milliseconds
                : "0" + milliseconds
            : "" + milliseconds;

    return minutesString + ":" + secondsString + "." + millisecondsString;
}
