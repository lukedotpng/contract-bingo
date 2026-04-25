"use client";

import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { ResponseStatus } from "@/lib/globals";
import { useMutation, useQuery } from "convex/react";
import BingoBoardPreview from "./BingoBoardPreview";
import ContractsList from "./ContractsList";
import ContractSubmission from "./ContractSubmission";
import TeamsList from "./TeamsList";

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
    const boardSeedMutation = useMutation(api.board.generateNewSeed);

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

    function RegenerateSeed() {
        if (board !== ResponseStatus.NOT_FOUND && board !== undefined) {
            boardSeedMutation({ boardId: board._id });
        }
    }

    /* INFO: Change all team colors

    match.teamIds.forEach(teamId => useMutation(api.team.changeTeamColor)({ teamId: teamId }));
    */

    /* INFO: Set start time

    match.startTime = startTimeArg;
    */

    /* INFO: Edit grace period length

    match.gracePeriodLength = gracePeriodArg;
    */

    if (
        match === undefined ||
        board === undefined ||
        matchContracts === undefined ||
        teams === undefined
    ) {
        return <p>{"Loading..."}</p>;
    }

    return (
        <main>
            <div className="flex flex-row-reverse flex-wrap justify-center">
                {/* Settings */}
                <section className="p-2 flex-1 flex flex-col gap-4 max-w-100">
                    <ContractSubmission
                        AddSingleContract={AddSingleContract}
                        AddBulkContracts={AddBulkContracts}
                    />
                    <button
                        className="py-2 bg-slate-700 font-bold hover:underline"
                        onClick={RegenerateSeed}
                    >
                        {"Regenerate Board Seed"}
                    </button>
                    <TeamsList matchId={match._id} teams={teams} />
                </section>
                {/* Board */}
                <section className="grid gap-2 p-2 w-180 h-full">
                    <BingoBoardPreview
                        size={board.boardSize === "4x4" ? 4 : 5}
                        seed={board.seed}
                        contracts={matchContracts}
                    />
                    <ContractsList
                        contracts={matchContracts}
                        RemoveContract={() => console.log("removing contract")}
                    />
                </section>
            </div>
        </main>
    );
}
