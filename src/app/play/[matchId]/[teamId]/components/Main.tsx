"use client";

import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { ResponseStatus } from "@/lib/globals";
import { useQuery } from "convex/react";
import BingoBoard from "./BingoBoard";
import { useLocalState } from "@/lib/useLocalState";

export default function Main({
    matchId,
    teamId,
}: {
    matchId: Id<"match">;
    teamId: Id<"team">;
}) {
    const match = useQuery(api.match.getMatch, {
        matchId: matchId,
    });
    const matchContracts = useQuery(
        api.boardToContract.getAllContractsFromBoard,
        match !== undefined && match !== ResponseStatus.NOT_FOUND
            ? { boardId: match.boardId }
            : "skip",
    );
    const board = useQuery(
        api.board.getBoard,
        match !== undefined && match !== ResponseStatus.NOT_FOUND
            ? { boardId: match.boardId }
            : "skip",
    );
    const team = useQuery(api.team.getTeam, { teamId: teamId });

    const [playerName, setPlayerName] = useLocalState<{
        id: Id<"player">;
        name: string;
        platform: Platform;
    } | null>("player", null);

    /* INFO: Create player & set name and platform

    const createPlayer = useMutation(api.player.createPlayer);
    const player = await createPlayer({
        username: usernameArg,
        platform: platformArg,
    });

    if (player == undefined) return "unable to create player???? wtf";

    if (team!.playerIds?.includes(player._id)) return "player already exists within team";
    const addPlayerToTeam = useMutation(api.team.addPlayerToTeam);
    await addPlayerToTeam({ teamId, playerId: player._id });
    */

    /* INFO: local storage

        um i dunno how to implement this, sorry lukedog
        im trying to speedrun this so i can watch a turkish soap opera
        with my mom so i'll get back to this later
    */

    /* INFO: Submit scores for contracts

    const createScoreSubmission = useMutation(api.scoreSubmission.createScoreSubmission);
    const submission = await createScoreSubmission({
        teamId: teamId,
        playerId: playerIdArg,
        score: scoreArg,
    });

    if (submission == undefined) return "couldn't add submission!";

    const addBTCSubmission = useMutation(api.boardToContract.addBoardToContractSubmission);
    addBTCSubmission({
        btcId: btcIdArg,
        submissionId: submission._id,
    });
    */

    if (match === ResponseStatus.NOT_FOUND) {
        throw new Error("Match doesn't exist!");
    }
    if (board === ResponseStatus.NOT_FOUND) {
        throw new Error("Board doesn't exist!");
    }
    if (team === ResponseStatus.NOT_FOUND) {
        throw new Error("Team doesn't exist!");
    }
    if (
        match !== undefined &&
        team !== undefined &&
        !match.teamIds.includes(team._id)
    ) {
        throw new Error("Team doesn't exist in this match!");
    }

    if (
        match === undefined ||
        matchContracts === undefined ||
        team === undefined ||
        board === undefined
    ) {
        return <p>{"Loading..."}</p>;
    }

    if (match === undefined && team === undefined) {
        return <p>{"Loading..."}</p>;
    }

    return (
        <main>
            <div className="flex flex-row-reverse flex-wrap justify-end m-2 sm:m-4 gap-2">
                <section className="flex-1"></section>
                {/* Board */}
                <section className="grid gap-2 w-180 h-full">
                    <BingoBoard
                        size={board.boardSize === "4x4" ? 4 : 5}
                        seed={board.seed}
                        contracts={matchContracts}
                    />
                </section>
            </div>
        </main>
    );
}
