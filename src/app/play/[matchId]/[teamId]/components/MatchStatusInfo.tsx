import { Doc } from "db/_generated/dataModel";
import { useEffect, useRef, useState } from "react";
import TimeString from "@/app/components/TimeString";

export default function MatchStatusInfo({ match }: { match: Doc<"match"> }) {
    const [timeFromStart, setTimeFromStart] = useState<number>();
    const countdownRef = useRef<NodeJS.Timeout>(undefined);

    useEffect(() => {
        if (match.startTime === -1) {
            return;
        }

        countdownRef.current = setInterval(() => {
            if (match.startTime !== undefined) {
                const updatedTimeFromStart = match.startTime - Date.now();

                setTimeFromStart(updatedTimeFromStart);
            }
        }, 100);

        return () => clearInterval(countdownRef.current);
    }, [match.startTime, match._id]);

    return (
        <div className="w-full">
            {match.status === "finished" && (
                <div>
                    <p className="text-4xl font-bold">{"Match Finished!"}</p>
                </div>
            )}
            {match.status !== "finished" && (
                <>
                    <div>
                        {timeFromStart !== undefined &&
                            match.startTime !== -1 && (
                                <>
                                    <p
                                        data-matchactive={
                                            match.status === "active"
                                        }
                                        className="text-2xl data-[matchactive=true]:font-bold data-[matchactive=true]:uppercase"
                                    >
                                        {match.status === "active"
                                            ? "Match Time: "
                                            : "Match starts in: "}
                                        <span
                                            data-matchactive={
                                                match.status === "active"
                                            }
                                            className="data-[matchactive=true]:before:content-['+']"
                                        >
                                            <TimeString
                                                ms={Math.abs(timeFromStart)}
                                            />
                                        </span>
                                    </p>
                                    {timeFromStart < 0 &&
                                        Math.abs(timeFromStart) <
                                            match.gracePeriodLength *
                                                60 *
                                                1000 && (
                                            <p className="text-3xl font-bold uppercase text-amber-300">
                                                {"GRACE PERIOD: "}
                                                <span
                                                    data-matchactive={
                                                        match.status ===
                                                        "active"
                                                    }
                                                >
                                                    <TimeString
                                                        ms={Math.abs(
                                                            match.gracePeriodLength *
                                                                60 *
                                                                1000 +
                                                                timeFromStart,
                                                        )}
                                                    />
                                                </span>
                                            </p>
                                        )}
                                </>
                            )}
                        {(match.startTime === -1 ||
                            match.startTime === undefined) && (
                            <p className="text-2xl font-bold">
                                {"Match starting soon..."}
                            </p>
                        )}
                    </div>
                    <div>
                        <p>
                            <span className="font-bold">{"Start time: "}</span>
                            <span>
                                {match.startTime === undefined ||
                                match.startTime === -1
                                    ? "Not set"
                                    : new Date(
                                          match.startTime,
                                      ).toLocaleString()}
                            </span>
                        </p>
                        <p>
                            <span className="font-bold">
                                {"Grace Period Length: "}
                            </span>
                            <span>{match.gracePeriodLength} minutes</span>
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
