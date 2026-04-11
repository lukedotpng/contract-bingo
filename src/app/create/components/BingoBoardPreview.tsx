import { FormatContractLocation } from "@/lib/FormattingUtils";

export default function BingoBoardPreview({
    size,
    contracts,
}: {
    size: number;
    contracts: Contract[];
}) {
    const bingoSquares = [];
    for (let i = 0; i < size ** 2; i++) {
        const contract = contracts[i];
        if (contract) {
            bingoSquares.push(
                <div
                    key={i}
                    className="grid aspect-square border-2 border-slate-700 hover:border-slate-200"
                >
                    <div
                        className="grid items-end bg-slate-700 bg-center text-center text-balance"
                        style={{
                            backgroundImage: `url(/${contract.location}_background.webp)`,
                        }}
                    >
                        <div className="grid content-center h-[2lh] p-0.5 bg-slate-800/80 align-middle">
                            <p>{FormatContractLocation(contract.location)}</p>
                        </div>
                    </div>
                </div>,
            );
        } else {
            bingoSquares.push(
                <div
                    key={i}
                    className="grid aspect-square border-2 border-slate-700"
                >
                    <div className="grid place-content-center bg-slate-700 inset-shadow-[0_0_30px_var(--color-slate-900)]"></div>
                </div>,
            );
        }
    }

    return (
        <div
            data-gridsize={size}
            className="grid gap-1 data-[gridsize=5]:grid-cols-5 data-[gridsize=5]:grid-rows-5 data-[gridsize=4]:grid-cols-4 data-[gridsize=4]:grid-rows-4 text-sm"
        >
            {bingoSquares}
        </div>
    );
}
