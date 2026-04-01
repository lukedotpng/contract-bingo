import { FormatContractLocation } from "@/lib/FormattingUtils";

export default function ContractsList({
    contracts,
}: {
    contracts: Contract[];
}) {
    return (
        <div className="flex flex-col gap-2">
            {contracts.map((contract, index) => (
                <details
                    key={index}
                    className="group bg-slate-600 w-full max-w-96 border-2 border-slate-400"
                >
                    <summary className="p-1 font-bold group-[:open]:border-b-2 border-slate-400 has-[]:">
                        <span>{FormatContractLocation(contract.location)}</span>
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
                            <p>{contract.steamId ?? "No contract id"}</p>
                        </li>
                        <li className="p-1 bg-slate-600">
                            <div className="flex gap-1 items-center text-sm">
                                <p>{"PlayStation:"}</p>
                            </div>
                            <p>{contract.playstationId ?? "No contract id"}</p>
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
                            <p>{contract.switchId ?? "No contract id"}</p>
                        </li>
                    </ul>
                </details>
            ))}
        </div>
    );
}
