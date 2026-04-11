"use client";

import { useEffect, useState } from "react";
import BoardSizeSelection from "./components/BoardSizeSelection";
import TeamCountSelection from "./components/TeamCountSelection";
import ContractIdUpload from "./components/ContractSubmission";
import ContractsList from "./components/ContractsList";
import BingoBoardPreview from "./components/BingoBoardPreview";
import { api } from "@/../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { ResponseStatus } from "@/lib/globals";
import { redirect } from "next/navigation";

export default function Page() {
    const matchCreator = useMutation(api.match.createInitialMatch);
    const contractCreator = useMutation(
        api.contract.createBulkContractsWithBoard,
    );

    const [matchId, setMatchId] = useState<Id<"match">>();
    const match = useQuery(
        api.match.getMatch,
        matchId !== undefined ? { matchId: matchId } : "skip",
    );
    const [boardSize, setBoardSize] = useState(4);

    const MAX_TEAM_COUNT = 10;
    const MIN_TEAM_COUNT = 2;
    const [teamCount, setTeamCount] = useState(2);
    const [contracts, setContracts] = useState<Contract[]>([]);
    function AddContracts(newContracts: Contract[]) {
        setContracts((oldContracts) => [...oldContracts, ...newContracts]);
    }
    function RemoveContract(contractId: string) {
        setContracts((contracts) =>
            contracts.filter((c) => c.id !== contractId),
        );
    }

    function CreateMatch() {
        const matchIdPromise = matchCreator({
            gracePeriodLength: 10,
            boardSize: boardSize === 4 ? "4x4" : "5x5",
            teamCount: teamCount,
        });
        matchIdPromise.then((matchIdRes) => {
            setMatchId(matchIdRes);
        });
    }

    useEffect(() => {
        if (match !== undefined && match !== ResponseStatus.NOT_FOUND) {
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
            const contractPromise = contractCreator({
                boardId: match.boardId,
                contracts: contractsNoId,
            });
            contractPromise.then(() => {
                redirect("/host/" + match._id + "/" + match.adminId);
            });
        }
    }, [match, contractCreator, contracts]);

    return (
        <main>
            <div className="flex flex-row-reverse flex-wrap justify-center">
                {/* Settings */}
                <section className="p-2 flex-1 flex flex-col gap-4 max-w-96 max-h-180">
                    <BoardSizeSelection
                        boardSize={boardSize}
                        UpdateBoardSize={setBoardSize}
                    />
                    <TeamCountSelection
                        teamCount={teamCount}
                        UpdateTeamCount={setTeamCount}
                        minCount={MIN_TEAM_COUNT}
                        maxCount={MAX_TEAM_COUNT}
                    />
                    <ContractIdUpload AddContracts={AddContracts} />
                    <ContractsList
                        contracts={contracts}
                        RemoveContract={RemoveContract}
                    />
                </section>
                {/* Board */}
                <section className="p-2 w-180 h-full">
                    <BingoBoardPreview size={boardSize} contracts={contracts} />
                </section>
            </div>
            <div className="grid place-content-center">
                <button
                    className="w-50 py-2 bg-slate-700 border-2 border-slate-600 font-bold hover:underline"
                    onClick={CreateMatch}
                >
                    {"Create Match"}
                </button>
            </div>
        </main>
    );
}
