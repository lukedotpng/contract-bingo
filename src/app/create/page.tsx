"use client";

import { useRef, useState } from "react";

export default function Page() {
    const [boardSize, setBoardSize] = useState(4);

    const MAX_TEAM_COUNT = 10;
    const MIN_TEAM_COUNT = 2;
    const [teamCount, setTeamCount] = useState(2);

    const bulkContractDialog = useRef<HTMLDialogElement>(null);
    function ShowBulkContractDialog() {
        if (bulkContractDialog.current) {
            bulkContractDialog.current.showModal();
        }
    }
    function CloseBulkContractDialog() {
        if (bulkContractDialog.current) {
            bulkContractDialog.current.close();
        }
    }

    // temp
    const matchContracts: string[] = new Array(boardSize ** 2);
    matchContracts.fill("hi");

    const teamElements = [];
    for (let i = MIN_TEAM_COUNT; i <= MAX_TEAM_COUNT; i++) {
        teamElements.push(
            <button
                key={i}
                role="checkbox"
                aria-checked={teamCount === i}
                className="flex-1 py-2 bg-slate-600 hover:underline aria-checked:inset-shadow-[0_0_7px_#000000] inset-shadow-black "
                onClick={() => {
                    setTeamCount(i);
                }}
            >
                {i}
            </button>,
        );
    }

    return (
        <main className="flex flex-row-reverse flex-wrap justify-end">
            {/* Settings */}
            <section className="p-2 flex-1 flex flex-col gap-4">
                <div>
                    <p className="font-bold">{"Board Size"}</p>
                    <div className="flex font-bold max-w-96 w-full p-0.5 bg-slate-600 gap-1">
                        <button
                            role="checkbox"
                            aria-checked={boardSize === 4}
                            className="flex-1 py-2 bg-slate-600 hover:underline aria-checked:inset-shadow-[0_0_7px_#000000] inset-shadow-black"
                            onClick={() => {
                                setBoardSize(4);
                            }}
                        >
                            {"4x4"}
                        </button>
                        <button
                            role="checkbox"
                            aria-checked={boardSize === 5}
                            className="flex-1 py-2 bg-slate-600 hover:underline aria-checked:inset-shadow-[0_0_7px_#000000] inset-shadow-black"
                            onClick={() => {
                                setBoardSize(5);
                            }}
                        >
                            {"5x5"}
                        </button>
                    </div>
                </div>
                {/*Team Count*/}
                <div>
                    <p className="font-bold">{"# of Teams"}</p>
                    <div className="flex font-bold max-w-96 w-full bg-slate-600 p-0.5 gap-1">
                        {teamElements}
                    </div>
                </div>
                {/*Contract ID Upload*/}
                <div>
                    <p className="font-bold">{"Contract IDs"}</p>
                    <div className="flex font-bold max-w-96 w-full gap-2">
                        <button className="flex-1 py-2 bg-slate-600 hover:underline">
                            {"Add"}
                        </button>
                        <button
                            className="flex-1 py-2 bg-slate-600 hover:underline"
                            onClick={ShowBulkContractDialog}
                        >
                            {"Bulk Add"}
                        </button>
                    </div>
                    <dialog
                        ref={bulkContractDialog}
                        closedby="any"
                        className="m-auto p-2 bg-slate-800 border-2 border-slate-400 backdrop:bg-slate-950/50 w-full max-w-[min(40rem,95%)] h-64 text-white"
                    >
                        <div className="flex flex-col h-full gap-2">
                            <div className="flex justify-between items-center">
                                <h1 className="text-lg font-bold">
                                    {"Bulk ID Submission"}
                                </h1>
                                <button
                                    className="py-1 px-4 bg-slate-600 hover:underline"
                                    onClick={CloseBulkContractDialog}
                                >
                                    {"Close"}
                                </button>
                            </div>
                            <textarea
                                autoFocus
                                placeholder="epic-id,steam-id,xbox-id,playstation-id,switch-id"
                                className="flex-1 resize-none text-black bg-slate-50 p-0.5 border-2 border-slate-400"
                            ></textarea>
                            <button
                                className="py-1 px-8 bg-slate-600 hover:underline place-self-center"
                                onClick={CloseBulkContractDialog}
                            >
                                {"Submit"}
                            </button>
                        </div>
                    </dialog>
                </div>
            </section>
            {/* Board */}
            <section className="p-2 w-180">
                <div
                    data-gridsize={boardSize}
                    className="grid gap-1 data-[gridsize=5]:grid-cols-5 data-[gridsize=5]:grid-rows-5 data-[gridsize=4]:grid-cols-4 data-[gridsize=4]:grid-rows-4"
                >
                    {matchContracts.map((contract, index) => (
                        <div
                            key={index}
                            className="bg-gray-200 text-black aspect-square grid place-content-center"
                        >
                            {contract}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
