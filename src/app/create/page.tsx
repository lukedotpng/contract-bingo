"use client";

import { ParseBulkContractIds } from "@/lib/ContractUtils";
import { FormatContractLocation } from "@/lib/FormattingUtils";
import { useMemo, useRef, useState } from "react";

export default function Page() {
    const [boardSize, setBoardSize] = useState(4);

    const MAX_TEAM_COUNT = 10;
    const MIN_TEAM_COUNT = 2;
    const [teamCount, setTeamCount] = useState(2);

    const [bulkContractInput, setBulkContractInput] = useState("");
    const lineMeasureRef = useRef<HTMLSpanElement>(null);
    const bulkContractTextAreaRef = useRef<HTMLTextAreaElement>(null);

    // string variable for representing line numbers in bulk contract form
    // uses invisible span for measuring line length to check for line overflow
    const bulkContractInputLineNumbers = useMemo(() => {
        let lineNumbersText = "";
        const lines = bulkContractInput.split("\n");
        for (let i = 0; i < lines.length; i++) {
            let textAreaLinesUsed = 1;
            if (lineMeasureRef.current && bulkContractTextAreaRef.current) {
                lineMeasureRef.current.textContent = lines[i];
                const lineWidth =
                    lineMeasureRef.current.getBoundingClientRect().width;
                const textAreaWidth =
                    bulkContractTextAreaRef.current.getBoundingClientRect()
                        .width;

                textAreaLinesUsed = Math.ceil(lineWidth / textAreaWidth);
            }
            lineNumbersText += i + 1 + "\n";
            for (let k = 1; k < textAreaLinesUsed; k++) {
                lineNumbersText += "\n";
            }
        }
        if (bulkContractTextAreaRef.current) {
            bulkContractTextAreaRef.current.style.height =
                bulkContractTextAreaRef.current.scrollHeight + "px";
        }
        return lineNumbersText;
    }, [bulkContractInput]);

    const [contracts, setContracts] = useState<Contract[]>([]);
    function BulkSubmitContracts() {
        const parsedContracts = ParseBulkContractIds(bulkContractInput);
        if (parsedContracts.error !== undefined) {
            console.error(parsedContracts.error);
        } else {
            setContracts(parsedContracts.contracts);
        }
        CloseBulkContractDialog();
    }

    const bulkContractDialog = useRef<HTMLDialogElement>(null);
    function ShowBulkContractDialog() {
        if (bulkContractDialog.current) {
            bulkContractDialog.current.showModal();
        }
    }
    function CloseBulkContractDialog() {
        if (bulkContractDialog.current) {
            setBulkContractInput("");
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
            <section className="p-2 flex-1 flex flex-col gap-4 box-content">
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
                        className="m-auto p-2 bg-slate-800 border-2 border-slate-400 backdrop:bg-slate-950/50 w-full max-w-[min(40rem,95%)] h-100 text-white"
                    >
                        <form
                            className="flex flex-col gap-2 h-full"
                            onSubmit={(
                                e: React.SubmitEvent<HTMLFormElement>,
                            ) => {
                                e.preventDefault();
                                BulkSubmitContracts();
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <h1 className="text-lg font-bold">
                                    {"Bulk ID Submission"}
                                </h1>
                                <button
                                    type="button"
                                    className="py-1 px-4 bg-slate-600 hover:underline"
                                    onClick={CloseBulkContractDialog}
                                >
                                    {"Close"}
                                </button>
                            </div>
                            <div className="flex border-2 bg-slate-600 border-slate-400 has-[textarea:focus]:outline-1 outline-offset-1 outline-slate-50 h-full overflow-scroll">
                                <span
                                    className="whitespace-pre w-[3ch] text-white py-0.5 h-full text-center"
                                    // TODO: Focus other text area when this is clicked
                                >
                                    {bulkContractInputLineNumbers}
                                </span>
                                <textarea
                                    ref={bulkContractTextAreaRef}
                                    className="flex-1 min-h-full resize-none text-black bg-slate-50 p-0.5 outline-none overflow-clip"
                                    value={bulkContractInput}
                                    onInput={(
                                        e: React.InputEvent<HTMLTextAreaElement>,
                                    ) => {
                                        setBulkContractInput(
                                            e.currentTarget.value,
                                        );
                                    }}
                                    placeholder="epic-id,steam-id,playstation-id,xbox-id,switch-id"
                                    autoFocus
                                ></textarea>
                                <span
                                    ref={lineMeasureRef}
                                    id="linemeasurer"
                                    className="fixed invisible"
                                    aria-hidden
                                >
                                    {bulkContractInput}
                                </span>
                            </div>
                            <button
                                className="py-1 px-8 bg-slate-600 hover:underline place-self-center"
                                type="submit"
                            >
                                {"Submit"}
                            </button>
                        </form>
                    </dialog>
                </div>
                {/* Contracts List */}
                <div className="flex flex-col gap-2">
                    {contracts.map((contract, index) => (
                        <details
                            key={index}
                            className="group bg-slate-600 w-full max-w-96 border-2 border-slate-400"
                        >
                            <summary className="p-1 font-bold group-[:open]:border-b-2 border-slate-400 has-[]:">
                                <span>
                                    {FormatContractLocation(contract.location)}
                                </span>
                            </summary>

                            <ul className="">
                                <li className="p-1 bg-slate-600">
                                    <div className="flex gap-1 items-center text-sm">
                                        <p>{"Epic:"}</p>
                                    </div>
                                    <p>{contract.epicId ?? "No contract id"}</p>
                                </li>
                                <li className="p-1 bg-slate-700">
                                    <div className="flex gap-1 items-center text-sm">
                                        <p>{"Steam:"}</p>
                                    </div>
                                    <p>
                                        {contract.steamId ?? "No contract id"}
                                    </p>
                                </li>
                                <li className="p-1 bg-slate-600">
                                    <div className="flex gap-1 items-center text-sm">
                                        <p>{"PlayStation:"}</p>
                                    </div>
                                    <p>
                                        {contract.playstationId ??
                                            "No contract id"}
                                    </p>
                                </li>
                                <li className="p-1 bg-slate-700">
                                    <div className="flex gap-1 items-center text-sm">
                                        <p>{"Xbox:"}</p>
                                    </div>
                                    <p>{contract.xboxId ?? "No contract id"}</p>
                                </li>
                                <li className="p-1 bg-slate-600">
                                    <div className="flex gap-1 items-center text-sm">
                                        <p>{"Nintendo Switch:"}</p>
                                    </div>
                                    <p>
                                        {contract.switchId ?? "No contract id"}
                                    </p>
                                </li>
                            </ul>
                        </details>
                    ))}
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
