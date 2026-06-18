"use client";

import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { ResponseStatus } from "@/lib/globals";
import { useMutation, useQuery } from "convex/react";
import BingoBoard from "./BingoBoard";
import { useLocalState } from "@/lib/useLocalState";
import PlayerJoinDialog from "./PlayerJoinDialog";
import BlankBingoBoard from "./BlankBingoBoard";
import PlayersList from "./PlayersList";
import { useState } from "react";
import ContractInfo from "./ContractInfo";
import MatchStatusInfo from "./MatchStatusInfo";

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
    const submissions = useQuery(
        api.scoreSubmission.getMatchScoreSubmissions,
        match !== undefined && match !== ResponseStatus.NOT_FOUND
            ? {
                  matchId: match._id,
              }
            : "skip",
    );

    const allTeams = useQuery(
        api.team.getTeams,
        match !== undefined && match !== ResponseStatus.NOT_FOUND
            ? { teamIds: match.teamIds }
            : "skip",
    );
    const team = useQuery(api.team.getTeam, { teamId: teamId });
    const teamPlayers = useQuery(
        api.team.getPlayersOfTeam,
        team !== undefined && team !== ResponseStatus.NOT_FOUND
            ? { teamId: team._id }
            : "skip",
    );

    const [localPlayerId, setLocalPlayerId] =
        useLocalState<Id<"player"> | null>("playerId", null);
    const player = useQuery(
        api.player.getPlayer,
        localPlayerId !== null ? { playerId: localPlayerId } : "skip",
    );

    const createPlayer = useMutation(api.player.createPlayer);

    function AddPlayer(username: string, platform: Platform) {
        if (team === undefined || team === ResponseStatus.NOT_FOUND) {
            return "Error: No team to join";
        }

        const res = createPlayer({
            username: username,
            platform: platform,
            teamId: team._id,
        });
        res.then((data) => {
            if (data === null) {
                console.error("Failed to create player");
                return;
            }

            setLocalPlayerId(data._id);
        });
    }

    const [focusedContractIndex, setFocusedContractIndex] = useState(-1);
    function UpdateFocusedContractIndex(newIndex: number) {
        if (newIndex === focusedContractIndex) {
            newIndex = -1;
        }
        setFocusedContractIndex(newIndex);
    }

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
    if (allTeams === ResponseStatus.NOT_FOUND) {
        throw new Error("Cannot find other teams!");
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
        board === undefined ||
        submissions === undefined ||
        allTeams === undefined ||
        teamPlayers === undefined
    ) {
        return <p>{"Loading..."}</p>;
    }

    if (
        localPlayerId === null ||
        player === ResponseStatus.NOT_FOUND ||
        !teamPlayers.some((teamPlayer) => teamPlayer._id === localPlayerId)
    ) {
        return (
            <main>
                <PlayerJoinDialog AddPlayer={AddPlayer} />
            </main>
        );
    }

    if (player === undefined) {
        return <p>{"Loading..."}</p>;
    }

    return (
        <main>
            <div className="flex flex-row-reverse flex-wrap justify-end m-2 sm:m-4 gap-2 sm:gap-4">
                <section className="flex-1 grid gap-4 h-fit">
                    <MatchStatusInfo match={match} />
                    <PlayersList player={player} teamPlayers={teamPlayers} />
                    <ContractInfo
                        match={match}
                        teamId={team._id}
                        contracts={matchContracts}
                        teams={allTeams}
                        player={player}
                        seed={board.seed}
                        boardSize={board.boardSize === "4x4" ? 4 : 5}
                        index={focusedContractIndex}
                        submissions={submissions}
                    />
                </section>
                {/* Board */}
                <section className="grid gap-2 w-180 h-full">
                    {(match.status === "pending" ||
                        match.status === "scheduled") && (
                        <BlankBingoBoard
                            size={board.boardSize === "4x4" ? 4 : 5}
                        />
                    )}
                    {(match.status === "active" ||
                        match.status === "finished") && (
                        <BingoBoard
                            size={board.boardSize === "4x4" ? 4 : 5}
                            seed={board.seed}
                            contracts={matchContracts}
                            teams={allTeams}
                            submissions={submissions}
                            focusedContractIndex={focusedContractIndex}
                            UpdateFocusedContractIndex={
                                UpdateFocusedContractIndex
                            }
                        />
                    )}
                </section>
            </div>
        </main>
    );
}
