import { Doc } from "db/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "db/_generated/api";
import { useEffect, useRef, useState } from "react";
import TimeString from "@/app/components/TimeString";

export default function MatchTimeManagement({
    match,
}: {
    match: Doc<"match">;
}) {
    const startTimeMutation = useMutation(api.match.setStartTime);
    const gracePeriodLengthMutation = useMutation(
        api.match.setGracePeriodLength,
    );
    const matchStatusMutation = useMutation(
        api.match.updateMatchResponseStatus,
    );

    const [startTimeOffset, setStartTimeOffset] = useState(-1);
    function UpdateStartTime() {
        if (startTimeOffset === -1) {
            startTimeMutation({ startTime: -1, matchId: match._id });
            matchStatusMutation({ status: "pending", matchId: match._id });
            return;
        }

        const newStartTime = Date.now() + startTimeOffset * 60 * 1000;
        startTimeMutation({ startTime: newStartTime, matchId: match._id });
        matchStatusMutation({ status: "scheduled", matchId: match._id });
    }

    function UpdateGracePeriodLength(newGracePeriodLength: number) {
        gracePeriodLengthMutation({
            gracePeriodLength: newGracePeriodLength,
            matchId: match._id,
        });
    }

    function EndMatch() {
        startTimeMutation({ matchId: match._id, startTime: -1 });
        matchStatusMutation({ matchId: match._id, status: "finished" });
    }

    const [timeFromStart, setTimeFromStart] = useState<number>();
    const countdownRef = useRef<NodeJS.Timeout>(undefined);

    useEffect(() => {
        if (match.startTime === -1) {
            return;
        }

        countdownRef.current = setInterval(() => {
            if (match.startTime !== undefined) {
                const updatedTimeFromStart = match.startTime - Date.now();

                if (updatedTimeFromStart < 0) {
                    matchStatusMutation({
                        status: "active",
                        matchId: match._id,
                    });
                }

                setTimeFromStart(updatedTimeFromStart);
            }
        }, 100);

        return () => clearInterval(countdownRef.current);
    }, [match.startTime, match._id, matchStatusMutation]);

    return (
        <div className="w-full">
            {match.status === "finished" && (
                <div>
                    <p className="text-2xl font-bold">{"Match Finished!"}</p>
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
                                            ? "Match started: "
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
                                            <p className="text-2xl font-bold uppercase text-amber-300">
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
                                {"No match time set"}
                            </p>
                        )}
                    </div>
                    <div>
                        <p>
                            <span className="font-bold">{"Start time: "}</span>
                            <span>
                                {match.startTime === undefined ||
                                match.startTime === -1
                                    ? "Unset"
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
                    <div className="grid grid-cols-[1fr_auto] items-center bg-slate-700 px-2 py-2">
                        <div className="grid grid-cols-2 gap-2 sm:max-w-96">
                            <div className="flex flex-col gap-1">
                                <label
                                    className="mr-[0.5ch] font-bold"
                                    htmlFor="match-start-delay"
                                >
                                    {"Start Match In:"}
                                </label>
                                <select
                                    name="match-start-delay"
                                    defaultValue={-1}
                                    onChange={(e) => {
                                        const selectValueInt = parseFloat(
                                            e.currentTarget.value,
                                        );
                                        if (isNaN(selectValueInt)) {
                                            return;
                                        }
                                        setStartTimeOffset(selectValueInt);
                                    }}
                                    className="px-1 border-2 border-slate-600 peer"
                                >
                                    <option
                                        value="-1"
                                        disabled
                                        className="bg-slate-500"
                                    >
                                        -- Select Start --
                                    </option>
                                    <option value="-1" className="bg-slate-500">
                                        Standby
                                    </option>
                                    <option
                                        value="0.1"
                                        className="bg-slate-500"
                                    >
                                        5 minutes
                                    </option>
                                    <option value="10" className="bg-slate-500">
                                        10 minutes
                                    </option>
                                    <option value="15" className="bg-slate-500">
                                        15 minutes
                                    </option>
                                    <option value="30" className="bg-slate-500">
                                        30 minutes
                                    </option>
                                    <option value="45" className="bg-slate-500">
                                        45 minutes
                                    </option>
                                    <option value="60" className="bg-slate-500">
                                        60 minutes
                                    </option>
                                </select>
                                <button
                                    className="mt-1 py-2 bg-slate-600 hover:underline"
                                    onClick={UpdateStartTime}
                                >
                                    {"Update Start"}
                                </button>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label
                                    data-matchstarted={
                                        match.status === "active"
                                    }
                                    className="mr-[0.5ch] font-bold"
                                    htmlFor="grace-period-length"
                                >
                                    {"Set Grace Period:"}
                                </label>
                                <select
                                    name="grace-period-length"
                                    value={match.gracePeriodLength}
                                    onChange={(e) => {
                                        const selectValueInt = parseInt(
                                            e.currentTarget.value,
                                        );
                                        if (isNaN(selectValueInt)) {
                                            return;
                                        }
                                        UpdateGracePeriodLength(selectValueInt);
                                    }}
                                    data-matchstarted={
                                        match.status === "active"
                                    }
                                    disabled={match.status === "active"}
                                    className="px-1 border-2 border-slate-600 disabled:text-slate-600"
                                >
                                    <option value="5" className="bg-slate-500">
                                        5 minutes
                                    </option>
                                    <option value="10" className="bg-slate-500">
                                        10 minutes
                                    </option>
                                    <option value="15" className="bg-slate-500">
                                        15 minutes
                                    </option>
                                    <option value="30" className="bg-slate-500">
                                        30 minutes
                                    </option>
                                    <option value="45" className="bg-slate-500">
                                        45 minutes
                                    </option>
                                    <option value="60" className="bg-slate-500">
                                        60 minutes
                                    </option>
                                </select>
                            </div>
                        </div>
                        {match.status === "active" && (
                            <div className="w-full text-right">
                                <button
                                    className="w-40 py-2 bg-red-500 font-bold hover:underline"
                                    onClick={EndMatch}
                                >
                                    {"Finish Match"}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
