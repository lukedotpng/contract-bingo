"use client";

import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { ResponseStatus } from "@/lib/globals";
import { useQuery } from "convex/react";
import OverlayBingoBoard from "./OverlayBingoBoard";

export default function Main({ matchId }: { matchId: Id<"match"> }) {
    const match = useQuery(api.match.getMatch, { matchId });
    const board = useQuery(
        api.board.getBoard,
        match !== undefined && match !== ResponseStatus.NOT_FOUND
            ? { boardId: match.boardId }
            : "skip",
    );
    const matchContracts = useQuery(
        api.boardToContract.getAllContractsFromBoard,
        match !== undefined && match !== ResponseStatus.NOT_FOUND
            ? { boardId: match.boardId }
            : "skip",
    );
    const teams = useQuery(
        api.team.getTeams,
        match !== undefined && match !== ResponseStatus.NOT_FOUND
            ? { teamIds: match.teamIds }
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

    if (match === ResponseStatus.NOT_FOUND) {
        throw new Error("Match doesn't exist!");
    }
    if (board === ResponseStatus.NOT_FOUND) {
        throw new Error("Board doesn't exist!");
    }
    if (teams === ResponseStatus.NOT_FOUND) {
        throw new Error("Unable to fetch teams");
    }

    if (
        match === undefined ||
        board === undefined ||
        matchContracts === undefined ||
        teams === undefined ||
        submissions === undefined
    ) {
        return <p>{"Loading..."}</p>;
    }

    return (
        <div className="w-250">
            <OverlayBingoBoard
                size={board.boardSize === "4x4" ? 4 : 5}
                seed={board.seed}
                contracts={matchContracts}
                teams={teams}
                submissions={submissions}
            />
        </div>
    );
}
