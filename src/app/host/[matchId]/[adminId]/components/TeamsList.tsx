import { Doc, Id } from "@/../convex/_generated/dataModel";
import TeamInfo from "./TeamInfo";

export default function TeamsList({
    matchId,
    teams,
}: {
    matchId: Id<"match">;
    teams: Doc<"team">[];
}) {
    return (
        <div>
            <p className="font-bold">{"Teams"}</p>
            <ol className="">
                {teams.map((team, index) => {
                    const teamLink =
                        window.location.origin +
                        "/play/" +
                        matchId +
                        "/" +
                        team._id;
                    return (
                        <TeamInfo
                            key={team._id}
                            team={team}
                            teamNumber={index}
                            teamLink={teamLink}
                        />
                    );
                })}
            </ol>
        </div>
    );
}
