"use client";

import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { ResponseStatus } from "@/lib/globals";
import { useQuery } from "convex/react";

export default function Main({ matchId }: { matchId: Id<"match"> }) {
    const match = useQuery(api.match.getMatch, { matchId });

    const board = useQuery(
        api.board.getBoard,
        match !== undefined && match !== ResponseStatus.NOT_FOUND
            ? { boardId: match.boardId }
            : "skip",
    );

    const boardContracts = useQuery(
        api.boardToContract.getAllBTCsFromBoard,
        board !== undefined && board !== ResponseStatus.NOT_FOUND
            ? { boardId: board._id }
            : "skip",
    );

    if (match == ResponseStatus.NOT_FOUND) {
        throw new Error("Match doesn't exist!");
    }
    if (board == ResponseStatus.NOT_FOUND) {
        throw new Error("No board exists for this match!");
    }

    if (match === undefined) {
        return <p>{"Loading..."}</p>;
    }

    return <p>{"MatchID: " + match._id}</p>;
}
