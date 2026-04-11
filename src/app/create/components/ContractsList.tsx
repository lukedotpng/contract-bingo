import { FormatContractLocation } from "@/lib/FormattingUtils";

export default function ContractsList({
    contracts,
    RemoveContract,
}: {
    contracts: Contract[];
    RemoveContract: (contractId: string) => void;
}) {
    return (
        <div className="max-w-195 grid lg:grid-cols-2 grid-cols-1 gap-2 align-baseline">
            {contracts.map((contract) => (
                <details
                    key={contract.id}
                    name="contract"
                    className="relative w-full max-w-96 bg-slate-700 border-2 border-slate-600 select-none sm:text-base text-sm has-[button:hover]:border-red-400"
                >
                    <summary
                        className="h-full p-1 font-bold cursor-default bg-center"
                        style={{
                            backgroundImage: `linear-gradient(to right, oklch(from var(--color-slate-800) l c h), oklch(from var(--color-slate-600) l c h / 40%)),url(/${contract.location}_background.webp)`,
                        }}
                    >
                        {FormatContractLocation(contract.location)}
                    </summary>

                    <div className="absolute w-full z-10 top-full -left-0.5 bg-slate-700 border-2 border-slate-600 border-t-0 box-content has-[button:hover]:border-red-400">
                        <ul>
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
                        <div className="w-full py-1 grid place-content-center">
                            <button
                                className="py-1 px-2 bg-slate-700 border-2 border-slate-600 text-center hover:underline"
                                onClick={() => RemoveContract(contract.id)}
                            >
                                {"Remove"}
                            </button>
                        </div>
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
        <li className="p-0.5 odd:bg-slate-800 even:bg-slate-700">
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
