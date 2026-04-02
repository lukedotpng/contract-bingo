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
                <div key={i} className="grid aspect-square bg-slate-600 p-1">
                    <div
                        className="grid items-center bg-slate-600 bg-center text-center text-balance font-bold"
                        style={{
                            backgroundImage: `url(/${contract.location}_background.webp)`,
                        }}
                    >
                        <p className="w-full bg-slate-900/50">
                            {FormatContractLocation(contract.location)}
                        </p>
                    </div>
                </div>,
            );
        } else {
            bingoSquares.push(
                <div key={i} className="grid aspect-square bg-slate-600 p-1">
                    <div className="grid place-content-center bg-slate-600 inset-shadow-[0_0_30px_var(--color-slate-900)] text-lg font-bold"></div>
                </div>,
            );
        }
    }

    return (
        <div
            data-gridsize={size}
            className="grid gap-1 data-[gridsize=5]:grid-cols-5 data-[gridsize=5]:grid-rows-5 data-[gridsize=4]:grid-cols-4 data-[gridsize=4]:grid-rows-4"
        >
            {bingoSquares}
        </div>
    );
}
