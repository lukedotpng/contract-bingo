export default function BlankBingoBoard({ size }: { size: number }) {
    const bingoSquares = [];
    for (let i = 0; i < size ** 2; i++) {
        bingoSquares.push(
            <div
                key={i}
                className="grid aspect-square border-2 border-slate-600 bg-slate-700 hover:border-slate-200 bingo-card"
                data-row={Math.floor(i / size) + 1}
                data-col={(i % size) + 1}
            >
                <div className="grid place-content-center inset-shadow-[0_0_30px_var(--color-slate-900)]"></div>
            </div>,
        );
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
