"use client";

import { useState } from "react";
import BoardSizeSelection from "./components/BoardSizeSelection";
import TeamCountSelection from "./components/TeamCountSelection";
import ContractIdUpload from "./components/ContractSubmission";
import ContractsList from "./components/ContractsList";
import BingoBoardPreview from "./components/BingoBoardPreview";

export default function Page() {
    const [boardSize, setBoardSize] = useState(4);

    const MAX_TEAM_COUNT = 10;
    const MIN_TEAM_COUNT = 2;
    const [teamCount, setTeamCount] = useState(2);
    const [contracts, setContracts] = useState<Contract[]>([]);
    function AddContracts(newContracts: Contract[]) {
        setContracts((oldContracts) => [...oldContracts, ...newContracts]);
    }

    return (
        <main className="flex flex-row-reverse flex-wrap justify-end">
            {/* Settings */}
            <section className="p-2 flex-1 flex flex-col gap-4 box-content">
                <BoardSizeSelection
                    boardSize={boardSize}
                    UpdateBoardSize={setBoardSize}
                />
                {/*Team Count*/}
                <TeamCountSelection
                    teamCount={teamCount}
                    UpdateTeamCount={setTeamCount}
                    minCount={MIN_TEAM_COUNT}
                    maxCount={MAX_TEAM_COUNT}
                />
                {/*Contract ID Upload*/}
                <ContractIdUpload AddContracts={AddContracts} />
                {/* Contracts List */}
                <ContractsList contracts={contracts} />
            </section>
            {/* Board */}
            <section className="p-2 w-180">
                <BingoBoardPreview size={boardSize} contracts={contracts} />
            </section>
        </main>
    );
}
