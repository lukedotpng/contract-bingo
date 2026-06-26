import { SecondsToTimeString } from "./FormattingUtils";

//Uses calculations from solderq35's time calculator (https://solderq35.github.io/time-calc-under-5/) to get all possible times under 5 min
export function ScoreToSeconds(score: number) {
    // Under 5 min calc
    let seconds = (210000 - score) * (3 / 400);
    console.log("seconds FIRST CALC:", seconds);

    if (seconds < 0 || seconds / 60 > 5) {
        // 5 to 15 min calc
        seconds = (175000 - score) * (3 / 50);
        console.log("seconds SECOND CALC:", seconds);
    }

    // Less than 0 or more than 15 min
    if (seconds < 0 || seconds > 15 * 60) {
        return undefined;
    }

    return seconds;
}

export function ScoreToTimeString(score: number) {
    const seconds = ScoreToSeconds(score);

    console.log("score:", score);
    console.log("seconds:", seconds);

    if (seconds === undefined) {
        return "Err No Time";
    }

    return SecondsToTimeString(seconds);
}
