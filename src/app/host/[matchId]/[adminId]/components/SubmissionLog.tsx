import { useQuery } from "convex/react";
import { api } from "db/_generated/api";
import { Doc } from "db/_generated/dataModel";

export default function SubmissionLog({ match }: { match: Doc<"match"> }) {
    const submissions = useQuery(api.scoreSubmission.getMatchScoreSubmissions, {
        matchId: match._id,
    });

    if (submissions === undefined) {
        return (
            <div>
                <h3>{"No submission yet"}</h3>
            </div>
        );
    }

    return (
        <div>
            <p className="font-bold">Time Submissions</p>
            <ol className="grid grid-cols-1 gap-2">
                {submissions.map((submission) => (
                    <li key={submission._id}>{"List Item"}</li>
                ))}
            </ol>
        </div>
    );
}
