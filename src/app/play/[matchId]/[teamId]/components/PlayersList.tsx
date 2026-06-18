import { useMutation } from "convex/react";
import { api } from "db/_generated/api";
import { Doc } from "db/_generated/dataModel";

export default function PlayersList({
    player,
    teamPlayers,
}: {
    player: Doc<"player"> | undefined;
    teamPlayers: Doc<"player">[] | undefined;
}) {
    const playerMutation = useMutation(api.player.updatePlayer);

    function UpdatePlayer(newPlatform: Platform) {
        if (player === undefined) {
            return;
        }
        playerMutation({
            platform: newPlatform,
            username: player.username,
            playerId: player._id,
        });
    }

    if (player === undefined || teamPlayers === undefined) {
        return (
            <li>
                <p>{"Loading team..."}</p>
            </li>
        );
    }

    return (
        <div className="bg-slate-700 w-full sm:max-w-96 p-2">
            <div className="grid grid-cols-2 font-bold mb-4">
                <p className="inline-block">{player.username}</p>
                <select
                    className="px-0.5 bg-slate-50 text-black border-2 border-slate-600 focus:outline-1 outline-slate-50 focus:outline-double"
                    required
                    name="platform"
                    id="platform"
                    value={player.platform}
                    onChange={(e) => {
                        UpdatePlayer(e.currentTarget.value as Platform);
                    }}
                >
                    <option value="Epic">Epic</option>
                    <option value="Steam">Steam</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Playstation">PlayStation</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                </select>
            </div>
            <details>
                <summary>{"View Team"}</summary>
                {teamPlayers !== undefined && teamPlayers.length === 1 && (
                    <p className="text-center p-1">{"No team members yet"}</p>
                )}
                {teamPlayers !== undefined && teamPlayers.length > 0 && (
                    <ul>
                        {teamPlayers.map((teamPlayer) => {
                            if (teamPlayer._id === player._id) {
                                return;
                            }

                            return (
                                <li key={teamPlayer._id} className="font-bold">
                                    <div className="grid grid-cols-2">
                                        <p>
                                            {teamPlayer.username}
                                            <span className="ml-2 font-normal">{`(${teamPlayer.platform})`}</span>
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </details>
        </div>
    );
}
