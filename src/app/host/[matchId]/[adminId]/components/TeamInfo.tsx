import { Doc } from "@/../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { useRef } from "react";

export default function TeamInfo({
    team,
    teamNumber,
    teamLink,
}: {
    team: Doc<"team">;
    teamNumber: number;
    teamLink: string;
}) {
    const players = useQuery(api.team.getPlayersOfTeam, { teamId: team._id });

    const playersDialogRef = useRef<HTMLDialogElement>(null);
    function ShowPlayersDialog() {
        if (playersDialogRef.current) {
            playersDialogRef.current.showModal();
        }
    }
    function ClosePlayersDialog() {
        if (playersDialogRef.current) {
            playersDialogRef.current.close();
        }
    }

    function CopyLink(link: string): Promise<void> {
        const res = navigator.clipboard.writeText(link);
        return res;
    }

    return (
        <li
            key={team._id}
            className="relative grid grid-cols-[auto_1fr] bg-slate-700 border-2 border-slate-600"
        >
            <div
                className="w-[2ch] border-r-2 border-slate-600"
                style={{
                    backgroundColor: team.color,
                }}
            ></div>
            <div className="w-full min-w-0">
                <div className="flex h-[1.4lh] items-center bg-slate-700 border-b border-slate-600 outline-2 outline-transparent  has-[input:focus]:outline-slate-300">
                    <p className="font-bold w-[3.5ch] text-center border-r-2 border-slate-600 cursor-default">
                        {`#${teamNumber + 1}`}
                    </p>
                    <input
                        type="text"
                        className="flex-1 min-w-0 h-full pl-1.5 text-ellipsis outline-none"
                        value={teamLink}
                        readOnly
                    />
                    <TeamLinkCopyButton link={teamLink} HandleCopy={CopyLink} />
                </div>
                <div className="flex w-full h-[1.4lh] items-center justify-between px-1.5 bg-slate-700 border-t border-slate-600">
                    <p>
                        {`${players !== undefined ? players.length : 0} joined`}
                    </p>
                    <button
                        className="relative flex items-center h-full hover:underline"
                        onClick={ShowPlayersDialog}
                    >
                        <p>{"View Players"}</p>
                    </button>
                </div>
            </div>
            <dialog
                ref={playersDialogRef}
                closedby="any"
                className="m-auto p-2 bg-slate-800 border-2 border-slate-600 backdrop:bg-slate-950/50 w-full max-w-[min(40rem,95%)] h-100 text-white"
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center">
                        <h1 className="text-lg font-bold">
                            {`Team #${teamNumber + 1}`}
                        </h1>
                        <button
                            type="button"
                            className="py-1 px-4 bg-slate-700 hover:underline"
                            onClick={ClosePlayersDialog}
                        >
                            {"Close"}
                        </button>
                    </div>
                    <ul>
                        {players &&
                            players.map((player) => (
                                <li key={player._id}>{player.username}</li>
                            ))}
                    </ul>
                    {(players === undefined || players.length === 0) && (
                        <div className="grid place-content-center flex-1">
                            <p className="text-xl">{"No Players Joined"}</p>
                        </div>
                    )}
                </div>
            </dialog>
        </li>
    );
}

function TeamLinkCopyButton({
    link,
    HandleCopy,
}: {
    link: string;
    HandleCopy: (link: string) => Promise<void>;
}) {
    const svgCheckAnimateRef = useRef<SVGAnimateElement>(null);

    return (
        <button
            className="group grid h-full bg-slate-700 border-l-2 border-slate-600"
            onClick={() => {
                const res = HandleCopy(link);
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
                className="h-full w-[3.5ch] py-1 place-self-center fill-white group-hover:py-0.75 duration-100"
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
