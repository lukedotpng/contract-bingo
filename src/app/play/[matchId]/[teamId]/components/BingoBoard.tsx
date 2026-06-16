import { FormatContractLocation } from "@/lib/FormattingUtils";
import { Doc } from "@/../convex/_generated/dataModel";
import { useMemo } from "react";
import Rand from "rand-seed";

export default function BingoBoard({
    size,
    seed,
    contracts,
}: {
    size: number;
    seed: string;
    contracts: Doc<"contract">[];
}) {
    const seededOrderContracts = useMemo(() => {
        const rand = new Rand(seed);
        const orderedContracts: Doc<"contract">[] = [...contracts];
        for (let i = contracts.length - 1; i >= 0; i--) {
            const j = Math.floor(rand.next() * i);
            const tempContract = orderedContracts[j];
            orderedContracts[j] = orderedContracts[i];
            orderedContracts[i] = tempContract;
        }
        return orderedContracts;
    }, [seed, contracts]);

    const bingoSquares = [];
    for (let i = 0; i < size ** 2; i++) {
        const contract = seededOrderContracts[i];
        if (contract) {
            bingoSquares.push(
                <div
                    key={i}
                    className="bingo-card grid aspect-square border-2 border-slate-700 hover:border-slate-200"
                    data-row={Math.floor(i / size) + 1}
                    data-col={(i % size) + 1}
                >
                    <div
                        className={`relative grid items-end bg-slate-700 bg-center text-center text-balance overflow-clip bingo-card-bg bingo-card-bg-${contract.location}`}
                    >
                        <div className="grid content-center min-h-[2lh] px-0.5 bg-slate-800/80 align-middle z-10">
                            <p>{FormatContractLocation(contract.location)}</p>
                        </div>
                    </div>
                </div>,
            );
        } else {
            bingoSquares.push(
                <div
                    key={i}
                    className="grid aspect-square border-2 border-slate-600"
                >
                    <div className="grid place-content-center bg-slate-700 inset-shadow-[0_0_30px_var(--color-slate-900)]"></div>
                </div>,
            );
        }
    }

    return (
        <div
            className={`grid ${size === 4 ? "board-size-4" : "board-size-5"} text-xxs sm:text-sm font-bold`}
        >
            {/* CORNER */}
            <div className="row-start-1 col-start-1 h-1 w-1"></div>

            {/* ROW MARKERS */}
            <div
                className="grid place-content-center row-start-1 col-start-2 mb-0.5 h-2.5 sm:h-4 bg-slate-700 col-marker"
                data-col="1"
            >
                {"1"}
            </div>
            <div
                className="grid place-content-center row-start-1 col-start-3 mb-0.5 h-2.5 sm:h-4 bg-slate-700 col-marker"
                data-col="2"
            >
                {"2"}
            </div>
            <div
                className="grid place-content-center row-start-1 col-start-4 mb-0.5 h-2.5 sm:h-4 bg-slate-700 col-marker"
                data-col="3"
            >
                {"3"}
            </div>
            <div
                className="grid place-content-center row-start-1 col-start-5 mb-0.5 h-2.5 sm:h-4 bg-slate-700 col-marker"
                data-col="4"
            >
                {"4"}
            </div>
            {size === 5 && (
                <div
                    className="grid place-content-center row-start-1 col-start-6 mb-0.5 h-2.5 sm:h-4 bg-slate-700 col-marker"
                    data-col="5"
                >
                    {"5"}
                </div>
            )}

            {/* COLUMN MARKERS */}
            <div
                className="grid place-content-center row-start-2 col-start-1 mr-0.5 w-2.5 sm:w-4 bg-slate-700 row-marker"
                data-row="1"
            >
                {"A"}
            </div>
            <div
                className="grid place-content-center row-start-3 col-start-1 mr-0.5 w-2.5 sm:w-4 bg-slate-700 row-marker"
                data-row="2"
            >
                {"B"}
            </div>
            <div
                className="grid place-content-center row-start-4 col-start-1 mr-0.5 w-2.5 sm:w-4 bg-slate-700 row-marker"
                data-row="3"
            >
                {"C"}
            </div>
            <div
                className="grid place-content-center row-start-5 col-start-1 mr-0.5 w-2.5 sm:w-4 bg-slate-700 row-marker"
                data-row="4"
            >
                {"D"}
            </div>
            {size === 5 && (
                <div
                    className="grid place-content-center row-start-6 col-start-1 mr-0.5 w-2.5 sm:w-4 bg-slate-700 row-marker"
                    data-row="5"
                >
                    {"E"}
                </div>
            )}

            {bingoSquares}
        </div>
    );
}
