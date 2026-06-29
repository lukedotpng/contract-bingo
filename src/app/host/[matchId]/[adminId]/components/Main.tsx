"use client";

import { api } from "@/../convex/_generated/api";
import { Doc, Id } from "@/../convex/_generated/dataModel";
import { ResponseStatus } from "@/lib/globals";
import { useMutation, useQuery } from "convex/react";
import BingoBoardPreview from "./BingoBoardPreview";
import ContractsList from "./ContractsList";
import TeamsList from "./TeamsList";
import AddContract from "./AddContract";
import BulkAddContracts from "./BulkAddContracts";
import MatchTimeManagement from "./MatchTimeManagement";
import SubmissionSection from "./SubmissionSection";
import BingoBoard from "@/app/components/BingoBoard";
import { useMemo, useState } from "react";
import Rand from "rand-seed";
import { IndexToPositionString } from "@/lib/BoardUtils";

export default function Main({
    matchId,
    adminId,
}: {
    matchId: Id<"match">;
    adminId: string;
}) {
    const singleContractMutation = useMutation(
        api.contract.createSingleContractWithBoard,
    );
    const bulkContractMutation = useMutation(
        api.contract.createBulkContractsWithBoard,
    );
    const removeContractFromBoardMutation = useMutation(api.boardToContract.deleteBoardToContract)

    const boardSeedMutation = useMutation(api.board.generateNewSeed);
    const startTimeMutation = useMutation(api.match.setStartTime);
    const gracePeriodLengthMutation = useMutation(
        api.match.setGracePeriodLength,
    );

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

    function AddSingleContract(contract: Contract) {
        if (board !== ResponseStatus.NOT_FOUND && board !== undefined) {
            const contractNoId = {
                epicId: contract.epicId,
                steamId: contract.steamId,
                playstationId: contract.playstationId,
                xboxId: contract.xboxId,
                switchId: contract.switchId,
                location: contract.location,
            };
            singleContractMutation({
                boardId: board._id,
                contract: contractNoId,
            });
        }
    }
    function AddBulkContracts(contracts: Contract[]) {
        if (board !== ResponseStatus.NOT_FOUND && board !== undefined) {
            const contractsNoId = contracts.map((c) => {
                return {
                    epicId: c.epicId,
                    steamId: c.steamId,
                    playstationId: c.playstationId,
                    xboxId: c.xboxId,
                    switchId: c.switchId,
                    location: c.location,
                };
            });
            bulkContractMutation({
                boardId: board._id,
                contracts: contractsNoId,
            });
        }
    }

    function RemoveContract(contractId: Id<"contract">) {
        if (board !== ResponseStatus.NOT_FOUND && board !== undefined) {
            removeContractFromBoardMutation({boardId: board._id, contractId: contractId})
        }
    }

    function RegenerateSeed() {
        if (board !== ResponseStatus.NOT_FOUND && board !== undefined) {
            boardSeedMutation({ boardId: board._id });
        }
    }

    if (match === ResponseStatus.NOT_FOUND) {
        throw new Error("Match doesn't exist!");
    }
    if (board === ResponseStatus.NOT_FOUND) {
        throw new Error("Board doesn't exist!");
    }
    if (match !== undefined && match.adminId !== adminId) {
        throw new Error("Invalid admin ID");
    }
    if (teams !== undefined && teams === ResponseStatus.NOT_FOUND) {
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
        <main>
            <div className="flex flex-row-reverse flex-wrap justify-end m-2 sm:m-4 gap-2 sm:gap-4">
                {/* Settings */}
                <section className="flex-1">
                    <MatchTimeManagement match={match} />
                    <div className="grid xl:grid-cols-[2fr_3fr] gap-2">
                        <TeamsList matchId={match._id} teams={teams} />
                        <SubmissionSection
                            submissions={focusedSubmissions}
                            teams={teams}
                            focusedContractLocation={focusedContract?.location}
                            focusedContractPosition={IndexToPositionString(
                                focusedContractIndex,
                                board.boardSize === "4x4" ? 4 : 5,
                            )}
                        />
                    </div>
                </section>
                {/* Board */}
                <section className="grid gap-2 w-180 h-full">
                    <BingoBoard
                        size={board.boardSize === "4x4" ? 4 : 5}
                        seed={board.seed}
                        contracts={matchContracts}
                        teams={teams}
                        submissions={submissions}
                        focusedContractIndex={focusedContractIndex}
                        UpdateFocusedContractIndex={UpdateFocusedContractIndex}
                    />
                    {(match.status === "scheduled" ||
                        match.status === "pending") && (
                        <div className="flex font-bold gap-2">
                            <AddContract AddContract={AddSingleContract} />
                            <BulkAddContracts AddContracts={AddBulkContracts} />
                            <button
                                className="flex-1 ml-[10%] py-2 bg-slate-700 disabled:text-slate-500"
                                onClick={RegenerateSeed}
                            >
                                {"Shuffle Board"}
                            </button>
                        </div>
                    )}
                    <ContractsList
                        contracts={matchContracts}
                        seed={board.seed}
                        boardSize={board.boardSize === "4x4" ? 4 : 5}
                        RemoveContract={RemoveContract}
                    />
                </section>
            </div>
        </main>
    );
}
