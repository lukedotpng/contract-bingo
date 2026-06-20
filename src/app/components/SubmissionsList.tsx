import { SecondsToTimeString } from "@/lib/FormattingUtils";
import { Doc, Id } from "db/_generated/dataModel";

export default function SubmissionsList({
    submissions,
    teams,
    isAdmin,
    teamId,
    ToggleStatus,
}: {
    submissions: Doc<"scoreSubmission">[];
    teams: Doc<"team">[];
    isAdmin: boolean;
    teamId?: Id<"team">;
    ToggleStatus: (
        submissionId: Id<"scoreSubmission">,
        currentStatus: "valid" | "rejected",
    ) => void;
}) {
    return (
        <ol className="grid gap-1 bg-slate-600 p-1 border-2 border-slate-500 max-h-96 overflow-y-scroll">
            {submissions.map((submission) => {
                return (
                    <li
                        key={submission._id}
                        data-rejected={submission.status === "rejected"}
                        className="group grid bg-slate-800 border-slate-700"
                    >
                        <div className="grid grid-cols-[auto_1fr]">
                            <div
                                className="w-4"
                                style={{
                                    backgroundColor: teams.find(
                                        (team) =>
                                            team._id === submission.teamId,
                                    )?.color,
                                }}
                            ></div>
                            <div className="grid grid-cols-[1fr_auto] items-center p-2">
                                <div className=" group-data-[rejected=true]:line-through decoration-2">
                                    <p>
                                        <span className="font-bold">
                                            {SecondsToTimeString(
                                                submission.seconds,
                                            )}
                                        </span>
                                        <span>{" by "}</span>
                                        <span className="font-bold">
                                            {submission.playerUsername}
                                        </span>
                                    </p>
                                    <p>
                                        <span>{"Score: "}</span>
                                        {submission.score}
                                    </p>
                                </div>
                                {(isAdmin ||
                                    (teamId === submission.teamId &&
                                        submission.status === "valid")) && (
                                    <button
                                        className="group-data-[rejected=true]:bg-slate-600 bg-red-500 hover:underline w-20 p-1 font-bold"
                                        onClick={() =>
                                            ToggleStatus(
                                                submission._id,
                                                submission.status,
                                            )
                                        }
                                    >
                                        {submission.status === "valid"
                                            ? "Reject"
                                            : "Accept"}
                                    </button>
                                )}
                                {!isAdmin &&
                                    teamId !== submission.teamId &&
                                    submission.status === "rejected" && (
                                        <p className="text-center font-bold text-red-500 ">
                                            {"Rejected"}
                                        </p>
                                    )}
                            </div>
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
