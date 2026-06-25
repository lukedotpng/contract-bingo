"use client";

import { api } from "@/../convex/_generated/api";
import { Doc, Id } from "@/../convex/_generated/dataModel";
import { ResponseStatus } from "@/lib/globals";
import { useQuery } from "convex/react";
import OverlayBingoBoard from "./OverlayBingoBoard";
import Rand from "rand-seed";
import { useState, useMemo } from "react";
import SubmissionsList from "./SubmissionList";
import { IndexToPositionString } from "@/lib/BoardUtils";

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

    const [focusedContractIndex, setFocusedContractIndex] = useState(-1);
    function UpdateFocusedContractIndex(newIndex: number) {
        if (newIndex === focusedContractIndex) {
            newIndex = -1;
        }
        setFocusedContractIndex(newIndex);
    }

    const focusedContract = useMemo(() => {
        if (
            focusedContractIndex === -1 ||
            board === undefined ||
            board === ResponseStatus.NOT_FOUND ||
            matchContracts === undefined
        ) {
            return undefined;
        }

        const rand = new Rand(board.seed);
        const orderedContracts: Doc<"contract">[] = [...matchContracts];
        for (let i = matchContracts.length - 1; i >= 0; i--) {
            const j = Math.floor(rand.next() * i);
            const tempContract = orderedContracts[j];
            orderedContracts[j] = orderedContracts[i];
            orderedContracts[i] = tempContract;
        }

        return orderedContracts[focusedContractIndex];
    }, [focusedContractIndex, board, matchContracts]);

    // Filter submissions to focused contract, show all if no contract focused
    const focusedSubmissions = useMemo(() => {
        if (submissions === undefined || matchContracts === undefined) {
            return [];
        }

        if (focusedContract === undefined) {
            return submissions;
        }

        const focusedSubmissions = submissions.filter(
            (submission) => submission.contractId === focusedContract._id,
        );
        focusedSubmissions.sort((a, b) => b.score - a.score);

        return focusedSubmissions;
    }, [focusedContract, matchContracts, submissions]);

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
                focusedContractIndex={focusedContractIndex}
                UpdateFocusedContractIndex={UpdateFocusedContractIndex}
            />
            <SubmissionsList
                submissions={focusedSubmissions}
                teams={teams}
                focusedContractLocation={focusedContract?.location}
                focusedContractPosition={IndexToPositionString(
                    focusedContractIndex,
                    board.boardSize === "4x4" ? 4 : 5,
                )}
            />
        </div>
    );
}
