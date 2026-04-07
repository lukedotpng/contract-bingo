import { Id } from "@/../convex/_generated/dataModel";
import { ResponseStatus } from "@/lib/globals";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { addBoardToContractSubmission } from "../../../../../convex/boardToContract";

export default async function Page({
    params,
}: {
    params: Promise<{ matchId: Id<"match">; teamId: Id<"team"> }>;
}) {
    const { matchId, teamId } = await params;

    const match = useQuery(api.match.getMatch, { matchId });
    const team = useQuery(api.team.getTeam, { teamId });

    if (match == ResponseStatus.NOT_FOUND) return "match doesn't exist!";
    if (team == ResponseStatus.NOT_FOUND) return "team doesn't exist!";
    if (!match!.teamIds.includes(teamId)) return "team doesn't exist in this match!";

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

    return (
        <div>
            <p>{"MatchID: " + matchId}</p>
            <p>{"TeamID: " + teamId}</p>
        </div>
    );
}
