export default function TimeString({ ms }: { ms: number }) {
    const hours = Math.floor(ms / (1000 * 3600));
    const minutes = Math.floor((ms % (3600 * 1000)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    const hoursString =
        hours < 10 ? (hours === 0 ? "00" : "0" + hours) : hours + "";
    const minutesString =
        minutes < 10 ? (minutes === 0 ? "00" : "0" + minutes) : minutes + "";
    const secondsString =
        seconds < 10 ? (seconds === 0 ? "00" : "0" + seconds) : seconds + "";

    return (
        <span className="tabular-nums">
            <span>{hoursString}</span>
            <span>{":"}</span>
            <span>{minutesString}</span>
            <span>{":"}</span>
            <span>{secondsString}</span>
        </span>
    );
}
