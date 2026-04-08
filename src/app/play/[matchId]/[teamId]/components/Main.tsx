"use client";

import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { ResponseStatus } from "@/lib/globals";
import { useQuery } from "convex/react";

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
    const team = useQuery(api.team.getTeam, { teamId: teamId });

    if (match === ResponseStatus.NOT_FOUND) {
        throw new Error("Match doesn't exist!");
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

    if (match === undefined && team === undefined) {
        return <p>{"Loading..."}</p>;
    }

    return (
        <div>
            <p>{"MatchID: " + matchId}</p>
            <p>{"TeamID: " + teamId}</p>
        </div>
    );
}
