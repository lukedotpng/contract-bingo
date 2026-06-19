import SubmissionsList from "@/app/components/SubmissionsList";
import { IndexToPositionString } from "@/lib/BoardUtils";
import {
    FormatContractLocation,
    SecondsToTimeString,
} from "@/lib/FormattingUtils";
import { useMutation } from "convex/react";
import { api } from "db/_generated/api";
import { Doc, Id } from "db/_generated/dataModel";
import Rand from "rand-seed";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ContractInfo({
    match,
    teamId,
    contracts,
    teams,
    player,
    seed,
    boardSize,
    index,
    submissions,
}: {
    match: Doc<"match">;
    teamId: Id<"team">;
    contracts: Doc<"contract">[];
    teams: Doc<"team">[];
    player: Doc<"player">;
    seed: string;
    boardSize: number;
    index: number;
    submissions: Doc<"scoreSubmission">[];
}) {
    const submissionMutation = useMutation(
        api.scoreSubmission.createScoreSubmission,
    );

    const contract = useMemo(() => {
        if (index === -1) {
            return undefined;
        }

        const rand = new Rand(seed);
        const orderedContracts: Doc<"contract">[] = [...contracts];
        for (let i = contracts.length - 1; i >= 0; i--) {
            const j = Math.floor(rand.next() * i);
            const tempContract = orderedContracts[j];
            orderedContracts[j] = orderedContracts[i];
            orderedContracts[i] = tempContract;
        }

        return orderedContracts[index];
    }, [seed, contracts, index]);

    const contractSubmissions = useMemo(() => {
        if (contract === undefined) {
            return [];
        }

        const contractSubmissions = submissions.filter(
            (submission) => submission.contractId === contract._id,
        );
        contractSubmissions.sort((a, b) => {
            // Sort by time then score
            const diff = a.seconds - b.seconds;
            if (diff === 0) {
                return b.score - a.score;
            }
            return diff;
        });

        return contractSubmissions;
    }, [contract, submissions]);

    const platformContractId = useMemo(() => {
        if (contract === undefined) {
            return undefined;
        }

        switch (player.platform) {
            case "Epic":
                return contract.epicId;
            case "Steam":
                return contract.steamId;
            case "Playstation":
                return contract.playstationId;
            case "Xbox":
                return contract.xboxId;
            case "Nintendo Switch":
                return contract.switchId;
            default:
                return undefined;
        }
    }, [contract, player.platform]);

    function CopyId(id: string): Promise<void> {
        const res = navigator.clipboard.writeText(id);
        return res;
    }

    const [minutes, setMinutes] = useState<number | string>("");
    const [seconds, setSeconds] = useState<number | string>("");
    const [score, setScore] = useState<number | string>("");
    // clear values on contract update
    useEffect(() => {
        setMinutes("");
        setSeconds("");
        setScore("");
    }, [index]);

    function SubmitTime() {
        if (contract === undefined) {
            return;
        }

        let totalSeconds = 0;
        if (typeof seconds === "number") {
            totalSeconds += seconds;
        }
        if (typeof minutes === "number") {
            totalSeconds += minutes * 60;
        }

        if (totalSeconds === 0 || typeof score === "string") {
            return;
        }

        submissionMutation({
            matchId: match._id,
            teamId: teamId,
            playerId: player._id,
            contractId: contract._id,
            playerUsername: player.username,
            seconds: totalSeconds,
            score: score,
            timestamp: Date.now(),
        });

        setMinutes("");
        setSeconds("");
        setScore("");
    }

    if (contract === undefined) {
        return;
    }

    return (
        <div className="bg-slate-700 p-2 w-full">
            <div className="grid grid-cols-[1fr_auto] items-center font-bold border-b-2 border-slate-600">
                <h3>{FormatContractLocation(contract.location)}</h3>
                <p>{IndexToPositionString(index, boardSize)}</p>
            </div>
            <div className="grid xl:grid-cols-2 gap-2 sm:gap-4">
                <div className="min-w-0">
                    {contractSubmissions.length === 0 && (
                        <h4>{"No times submitted"}</h4>
                    )}
                    {contractSubmissions.length > 0 && (
                        <div>
                            <h4 className="font-bold text-lg">{"Top Time"}</h4>
                            <div className="grid grid-cols-[auto_1fr] bg-slate-800 border-2 border-slate-600">
                                <div
                                    className="w-4"
                                    style={{
                                        backgroundColor: teams.find(
                                            (team) =>
                                                team._id ===
                                                contractSubmissions[0].teamId,
                                        )?.color,
                                    }}
                                ></div>
                                <div className="p-2">
                                    <p>
                                        <span className="font-bold">
                                            {SecondsToTimeString(
                                                contractSubmissions[0].seconds,
                                            )}
                                        </span>
                                        <span className="mx-2">{"by"}</span>
                                        <span className="font-bold">
                                            {
                                                contractSubmissions[0]
                                                    .playerUsername
                                            }
                                        </span>
                                    </p>
                                    <p>
                                        <span>{"Score: "}</span>
                                        {contractSubmissions[0].score}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mt-2">
                        <label htmlFor="contractid">
                            <span className="font-bold">{"Contract ID"}</span>
                            <span className="ml-[1ch]">{"("}</span>
                            <span>{player.platform}</span>
                            <span>{")"}</span>
                        </label>
                        <div className="flex h-[1.3lh] items-center bg-slate-700 border-2 border-slate-600 outline-2 outline-transparent  has-[input:focus]:outline-slate-300">
                            <input
                                type="text"
                                name="contractid"
                                id="contractid"
                                readOnly
                                value={platformContractId}
                                className="flex-1 min-w-0 h-full pl-1.5 text-ellipsis outline-none"
                            />
                            <CopyIdButton
                                contractId={platformContractId}
                                HandleCopy={CopyId}
                            />
                        </div>
                        {match.status !== "finished" && (
                            <div>
                                <h4 className="text-lg text-center font-bold mt-4 mb-1 mx-8 border-b-2 border-slate-600">
                                    {"Submit Time"}
                                </h4>
                                <form
                                    className="grid place-content-center gap-2 "
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        SubmitTime();
                                    }}
                                >
                                    <div className="flex justify-center gap-2">
                                        <div className="w-28">
                                            <p className="font-bold text-center">
                                                {"Time"}
                                            </p>
                                            <div className="inline-block">
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    name="minutes"
                                                    id="minutes"
                                                    placeholder="mm"
                                                    value={minutes}
                                                    onInput={(e) => {
                                                        if (
                                                            e.currentTarget
                                                                .value === ""
                                                        ) {
                                                            setMinutes("");
                                                            return;
                                                        }
                                                        const inputAsInt =
                                                            parseInt(
                                                                e.currentTarget
                                                                    .value,
                                                            );
                                                        if (
                                                            isNaN(inputAsInt) ||
                                                            inputAsInt > 59
                                                        ) {
                                                            return;
                                                        }

                                                        setMinutes(inputAsInt);
                                                    }}
                                                    className="w-12 bg-slate-50 text-black text-center border-2 border-slate-600 focus:outline-1 outline-slate-50 focus:outline-double"
                                                />
                                                <span className="inline-block font-bold w-4 text-center">
                                                    {":"}
                                                </span>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    name="seconds"
                                                    id="seconds"
                                                    placeholder="ss"
                                                    value={seconds}
                                                    onInput={(e) => {
                                                        if (
                                                            e.currentTarget
                                                                .value === ""
                                                        ) {
                                                            setSeconds("");
                                                            return;
                                                        }
                                                        const inputAsInt =
                                                            parseInt(
                                                                e.currentTarget
                                                                    .value,
                                                            );
                                                        if (
                                                            isNaN(inputAsInt) ||
                                                            inputAsInt > 59
                                                        ) {
                                                            return;
                                                        }

                                                        setSeconds(inputAsInt);
                                                    }}
                                                    className="w-12 bg-slate-50 text-black text-center border-2 border-slate-600 focus:outline-1 outline-slate-50 focus:outline-double"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-28">
                                            <p className="font-bold text-center">
                                                {"Score"}
                                            </p>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                name="score"
                                                id="score"
                                                placeholder="score..."
                                                value={score}
                                                onInput={(e) => {
                                                    if (
                                                        e.currentTarget
                                                            .value === ""
                                                    ) {
                                                        setScore("");
                                                        return;
                                                    }
                                                    const inputAsInt = parseInt(
                                                        e.currentTarget.value,
                                                    );
                                                    if (
                                                        isNaN(inputAsInt) ||
                                                        e.currentTarget.value
                                                            .length > 6
                                                    ) {
                                                        return;
                                                    }

                                                    setScore(inputAsInt);
                                                }}
                                                className="w-28 px-0.5 bg-slate-50 text-black border-2 border-slate-600 focus:outline-1 outline-slate-50 focus:outline-double"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="mt-2 py-2 px-8 bg-slate-600 hover:underline col-span-2"
                                    >
                                        {"Submit Score"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h4 className="text-lg font-bold">{"Times Submitted"}</h4>
                    <SubmissionsList
                        submissions={contractSubmissions}
                        teams={teams}
                    />
                </div>
            </div>
        </div>
    );
}

function CopyIdButton({
    contractId,
    HandleCopy,
}: {
    contractId: string | undefined;
    HandleCopy: (link: string) => Promise<void>;
}) {
    const svgCheckAnimateRef = useRef<SVGAnimateElement>(null);

    return (
        <button
            className="group grid h-full bg-slate-700 border-l-2 border-slate-600"
            onClick={() => {
                if (contractId === undefined) {
                    return;
                }
                const res = HandleCopy(contractId);
                res.then(() => {
                    svgCheckAnimateRef.current?.beginElement();
                }).catch(() => {
                    console.error("Failed to copy");
                });
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="h-full w-[3.5ch] py-0.5 place-self-center fill-white group-hover:py-0.25 duration-100"
            >
                {/*Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc.*/}
                <path d="M360 160L280 160C266.7 160 256 149.3 256 136C256 122.7 266.7 112 280 112L360 112C373.3 112 384 122.7 384 136C384 149.3 373.3 160 360 160zM360 208C397.1 208 427.6 180 431.6 144L448 144C456.8 144 464 151.2 464 160L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 160C176 151.2 183.2 144 192 144L208.4 144C212.4 180 242.9 208 280 208L360 208zM419.9 96C407 76.7 385 64 360 64L280 64C255 64 233 76.7 220.1 96L192 96C156.7 96 128 124.7 128 160L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 160C512 124.7 483.3 96 448 96L419.9 96z" />
                {/*Just check mark sourced from below*/}
                {/*Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc.*/}
                <path
                    fill="none"
                    d="M410.9 276.6C400.2 268.8 385.2 271.2 377.4 281.9L291.8 399.6L265.3 372.2C256.1 362.7 240.9 362.4 231.4 371.6C221.9 380.8 221.6 396 230.8 405.5L277.2 453.5C282.1 458.6 289 461.3 296.1 460.8C303.2 460.3 309.7 456.7 313.9 451L416.2 310.1C424 299.4 421.6 284.4 410.9 276.6z"
                >
                    <animate
                        ref={svgCheckAnimateRef}
                        attributeName="fill"
                        begin={"indefinite"}
                        dur={"1000ms"}
                        values="transparent;white;white;transparent"
                        keyTimes={"0;.1;1;1"}
                    />
                </path>
            </svg>
        </button>
    );
}
