import { FormatContractLocation } from "@/lib/FormattingUtils";
import { Doc, Id } from "@/../convex/_generated/dataModel";
import { useMemo } from "react";
import Rand from "rand-seed";
import { IndexToPositionString } from "@/lib/BoardUtils";

export default function ContractsList({
    contracts,
    seed,
    boardSize,
    RemoveContract,
}: {
    contracts: Doc<"contract">[];
    seed: string;
    boardSize: number;
    RemoveContract: (contractId: Id<"contract">) => void;
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

    return (
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 align-baseline">
            {seededOrderContracts.map((contract, index) => (
                <details
                    key={contract._id}
                    name="contract"
                    className="group relative w-full border-2 border-slate-600 select-none open:border-slate-200 has-[button:hover]:border-red-400 bg-top not-open:max-h-[calc(1lh+4px+0.5rem)] bg-slate-700"
                    style={{
                        backgroundImage: `linear-gradient(to right, oklch(from var(--color-slate-700) l c h), oklch(from var(--color-slate-700) l c h / 60%)),url(/${contract.location}_background.webp)`,
                    }}
                >
                    <summary className="grid grid-cols-[1fr_auto] p-1 font-bold cursor-default">
                        <p>{FormatContractLocation(contract.location)}</p>
                        <p className="text-shadow-[0px_0px_4px_black]">
                            {IndexToPositionString(index, boardSize)}
                        </p>
                    </summary>

                    <ul className="">
                        <ContractIdEntry
                            id={contract.epicId}
                            platform={"Epic"}
                        />
                        <ContractIdEntry
                            id={contract.steamId}
                            platform={"Steam"}
                        />
                        <ContractIdEntry
                            id={contract.playstationId}
                            platform={"PlayStation"}
                        />
                        <ContractIdEntry
                            id={contract.xboxId}
                            platform={"Xbox"}
                        />
                        <ContractIdEntry
                            id={contract.switchId}
                            platform={"Switch"}
                        />
                    </ul>
                    <div className="w-full py-1 grid place-content-center bg-slate-800">
                        <button
                            className=" text-center hover:underline"
                            onClick={() => RemoveContract(contract._id)}
                        >
                            {"Remove"}
                        </button>
                    </div>
                </details>
            ))}
        </div>
    );
}

function ContractIdEntry({
    id,
    platform,
}: {
    id: string | undefined;
    platform: "Epic" | "Steam" | "PlayStation" | "Xbox" | "Switch";
}) {
    return (
        <li className="p-0.5 border-b-2 last:border-none border-slate-300">
            <p className="text-xs">{platform}</p>
            {id !== undefined && (
                <p className="select-text align-text-top">{id}</p>
            )}
            {id === undefined && (
                <p className="select-text italic">{"No contract ID"}</p>
            )}
        </li>
    );
}
