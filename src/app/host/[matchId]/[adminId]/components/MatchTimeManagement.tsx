import { Id } from "db/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "db/_generated/api";

export default function MatchTimeManagement({
    matchId,
}: {
    matchId: Id<"match">;
}) {
    const startTimeMutation = useMutation(api.match.setStartTime);
    const gracePeriodLengthMutation = useMutation(
        api.match.setGracePeriodLength,
    );

    return (
        <div className="w-full">
            <div>
                <p>{"Set Start Time"}</p>
            </div>
            <div></div>
        </div>
    );
}
