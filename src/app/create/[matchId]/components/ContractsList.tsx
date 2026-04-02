import { FormatContractLocation } from "@/lib/FormattingUtils";

export default function ContractsList({
    contracts,
}: {
    contracts: Contract[];
}) {
    return (
        <div className="flex flex-col gap-2">
            {contracts.map((contract) => (
                <details
                    key={contract.id}
                    className="bg-slate-600 w-full max-w-96 border-2 border-slate-600 select-none"
                >
                    <summary
                        className="p-1 font-bold cursor-default bg-center "
                        style={{
                            backgroundImage: `linear-gradient(to right, oklch(from var(--color-slate-800) l c h), oklch(from var(--color-slate-600) l c h / 40%)),url(/${contract.location}_background.webp)`,
                        }}
                    >
                        {FormatContractLocation(contract.location)}
                    </summary>

                    <ul>
                        <li className="p-1 bg-slate-800">
                            <div className="flex gap-1 items-center text-sm">
                                <p>{"Epic:"}</p>
                            </div>
                            <p className="select-text">
                                {contract.epicId ?? "No contract id"}
                            </p>
                        </li>
                        <li className="p-1 bg-slate-700">
                            <div className="flex gap-1 items-center text-sm">
                                <p>{"Steam:"}</p>
                            </div>
                            <p className="select-text">
                                {contract.steamId ?? "No contract id"}
                            </p>
                        </li>
                        <li className="p-1 bg-slate-800">
                            <div className="flex gap-1 items-center text-sm">
                                <p>{"PlayStation:"}</p>
                            </div>
                            <p className="select-text">
                                {contract.playstationId ?? "No contract id"}
                            </p>
                        </li>
                        <li className="p-1 bg-slate-700">
                            <div className="flex gap-1 items-center text-sm">
                                <p>{"Xbox:"}</p>
                            </div>
                            <p className="select-text">
                                {contract.xboxId ?? "No contract id"}
                            </p>
                        </li>
                        <li className="p-1 bg-slate-800">
                            <div className="flex gap-1 items-center text-sm">
                                <p>{"Nintendo Switch:"}</p>
                            </div>
                            <p className="select-text">
                                {contract.switchId ?? "No contract id"}
                            </p>
                        </li>
                    </ul>
                </details>
            ))}
        </div>
    );
}
