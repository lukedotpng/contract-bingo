export default function BoardSizeSelection({
    boardSize,
    UpdateBoardSize,
}: {
    boardSize: number;
    UpdateBoardSize: (size: number) => void;
}) {
    return (
        <div>
            <p className="font-bold">{"Board Size"}</p>
            <div className="flex font-bold w-full p-0.5 bg-slate-700 gap-1">
                <button
                    role="checkbox"
                    aria-checked={boardSize === 4}
                    className="flex-1 py-2 bg-slate-700 hover:underline aria-checked:inset-shadow-[0_0_10px_var(--color-slate-900)]"
                    onClick={() => {
                        UpdateBoardSize(4);
                    }}
                >
                    {"4x4"}
                </button>
                <button
                    role="checkbox"
                    aria-checked={boardSize === 5}
                    className="flex-1 py-2 bg-slate-700 hover:underline aria-checked:inset-shadow-[0_0_10px_var(--color-slate-900)]"
                    onClick={() => {
                        UpdateBoardSize(5);
                    }}
                >
                    {"5x5"}
                </button>
            </div>
        </div>
    );
}
