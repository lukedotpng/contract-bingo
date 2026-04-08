export default function TeamCountSelection({
    teamCount,
    UpdateTeamCount,
    minCount,
    maxCount,
}: {
    teamCount: number;
    UpdateTeamCount: (teamCount: number) => void;
    minCount: number;
    maxCount: number;
}) {
    const teamElements = [];
    for (let i = minCount; i <= maxCount; i++) {
        teamElements.push(
            <button
                key={i}
                role="checkbox"
                aria-checked={teamCount === i}
                className="flex-1 py-2 bg-slate-700 hover:underline aria-checked:inset-shadow-[0_0_10px_var(--color-slate-900)]"
                onClick={() => {
                    UpdateTeamCount(i);
                }}
            >
                {i}
            </button>,
        );
    }

    return (
        <div>
            <p className="font-bold">{"# of Teams"}</p>
            <div className="flex font-bold max-w-96 w-full bg-slate-700 p-0.5 gap-1">
                {teamElements}
            </div>
        </div>
    );
}
