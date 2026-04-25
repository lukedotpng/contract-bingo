import { FormatContractLocation } from "@/lib/FormattingUtils";
import { Doc } from "@/../convex/_generated/dataModel";

export default function ContractsList({
    contracts,
    RemoveContract,
}: {
    contracts: Doc<"contract">[];
    RemoveContract: (contractId: string) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-2 align-baseline overflow-scroll">
            {contracts.map((contract) => (
                <details
                    key={contract._id}
                    name="contract"
                    className="group relative w-full border-2 border-slate-600 select-none text-base open:border-slate-200 has-[button:hover]:border-red-400 bg-center not-open:max-h-[calc(1lh+4px+0.5rem)]"
                    style={{
                        backgroundImage: `linear-gradient(to right, oklch(from var(--color-slate-800) l c h), oklch(from var(--color-slate-700) l c h / 40%)),url(/${contract.location}_background.webp)`,
                    }}
                >
                    <summary className="p-1 font-bold cursor-default group-open:bg-slate-700/70">
                        {FormatContractLocation(contract.location)}
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
        <li className="p-0.5 bg-slate-700/70 border-b-2 last:border-none border-slate-300">
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
