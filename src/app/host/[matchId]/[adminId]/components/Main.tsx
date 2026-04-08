"use client";

import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { ResponseStatus } from "@/lib/globals";
import { useQuery } from "convex/react";

export default function Main({
    matchId,
    adminId,
}: {
    matchId: Id<"match">;
    adminId: string;
}) {
    const match = useQuery(api.match.getMatch, { matchId });
    if (match == ResponseStatus.NOT_FOUND) {
        throw new Error("Match doesn't exist!");
    }
    if (match!.adminId != adminId) {
        throw new Error("Invalid admin ID");
    }

    /* INFO: Submit additional contracts

    const createContract = useMutation(api.contract.createContract);
    const contract = await createContract({
        epicId: epicIdArg,
        steamId: steamIdArg,
        xboxId: xboxIdArg,
        playstationId: playstationIdArg,
        switchId: switchIdArg,
        location: locationArg,
    });

    if (contract == ResponseStatus.BAD_REQUEST) return "need to specify at least one contract id";

    const createBoardToContract = useMutation(api.boardToContract.createBoardToContract);
    var status = await createBoardToContract({ boardId: match.boardId, contractId: contract!._id });
    if (status == ResponseStatus.NOT_FOUND) return "contract doesn't exist";
    */

    /* INFO: Regenerate board seed

    const generateNewSeed = useMutation(api.board.generateNewSeed);
    generateNewSeed({ boardId: match.boardId });
    */

    /* INFO: Change all team colors

    match.teamIds.forEach(teamId => useMutation(api.team.changeTeamColor)({ teamId: teamId }));
    */

    /* INFO: Set start time

    match.startTime = startTimeArg;
    */

    /* INFO: Edit grace period length

    match.gracePeriodLength = gracePeriodArg;
    */

    if (match === undefined) {
        <p>{"Loading..."}</p>;
    }

    return (
        <div>
            <p>{"MatchID: " + matchId}</p>
            <p>{"AdminID: " + adminId}</p>
        </div>
    );
}
