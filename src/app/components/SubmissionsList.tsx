import { SecondsToTimeString } from "@/lib/FormattingUtils";
import { Doc } from "db/_generated/dataModel";

export default function SubmissionsList({
    submissions,
    teams,
}: {
    submissions: Doc<"scoreSubmission">[];
    teams: Doc<"team">[];
}) {
    return (
        <ol className="grid gap-1 bg-slate-600 p-1 border-2 border-slate-500 max-h-96 overflow-scroll">
            {submissions.map((submission) => {
                return (
                    <li
                        key={submission._id}
                        className="grid grid-cols-[auto_1fr] bg-slate-800 border-slate-700"
                    >
                        <div
                            className="w-4"
                            style={{
                                backgroundColor: teams.find(
                                    (team) => team._id === submission.teamId,
                                )?.color,
                            }}
                        ></div>
                        <div className="p-2">
                            <p>
                                <span className="font-bold">
                                    {SecondsToTimeString(submission.seconds)}
                                </span>
                                <span className="mx-2">{"by"}</span>
                                <span className="font-bold">
                                    {submission.playerUsername}
                                </span>
                            </p>
                            <p>
                                <span>{"Score: "}</span>
                                {submission.score}
                            </p>
                        </div>
                    </li>
                );
            })}
            <li className="not-only:hidden text-center">
                {"No times submitted."}
            </li>
        </ol>
    );
}
