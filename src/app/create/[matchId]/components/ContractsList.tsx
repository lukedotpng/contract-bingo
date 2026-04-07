import { FormatContractLocation } from "@/lib/FormattingUtils";

export default function ContractsList({
    contracts,
}: {
    contracts: Contract[];
}) {
    return (
        <div className="max-w-195 grid lg:grid-cols-2 grid-cols-1 gap-2 align-baseline">
            {contracts.map((contract) => (
                <details
                    key={contract.id}
                    name="contract"
                    className="relative w-full max-w-96 bg-slate-700 border-2 border-slate-700 select-none sm:text-base text-sm"
                >
                    <summary
                        className="h-full p-1 font-bold cursor-default bg-center"
                        style={{
                            backgroundImage: `linear-gradient(to right, oklch(from var(--color-slate-800) l c h), oklch(from var(--color-slate-600) l c h / 40%)),url(/${contract.location}_background.webp)`,
                        }}
                    >
                        {FormatContractLocation(contract.location)}
                    </summary>

                    <ul className="absolute w-full z-10 top-full -left-0.5 border-2 border-slate-600 border-t-0 box-content">
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
