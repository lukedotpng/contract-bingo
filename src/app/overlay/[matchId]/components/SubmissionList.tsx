import {
    FormatContractLocation,
    SecondsToTimeString,
} from "@/lib/FormattingUtils";
import { Doc } from "db/_generated/dataModel";

export default function SubmissionsList({
    teams,
    submissions,
    focusedContractLocation,
    focusedContractPosition,
}: {
    teams: Doc<"team">[];
    submissions: Doc<"scoreSubmission">[];
    focusedContractLocation: ContractLocation | undefined;
    focusedContractPosition: string | undefined;
}) {
    return (
        <div className="text-2xl">
            <p className="font-bold h-12.5 grid place-content-center bg-slate-700">
                {`Times | ${focusedContractLocation !== undefined ? `${FormatContractLocation(focusedContractLocation)} (${focusedContractPosition})` : "All Contracts"}`}
            </p>
            <ol className="grid">
                {submissions.map((submission) => {
                    return (
                        <li
                            key={submission._id}
                            data-rejected={submission.status === "rejected"}
                            className="group grid bg-slate-800 border-4 border-t-0 border-slate-600 h-20 first:border-t-4"
                        >
                            <div className="grid grid-cols-[auto_1fr] gap-4">
                                <div
                                    className="w-8"
                                    style={{
                                        backgroundColor: teams.find(
                                            (team) =>
                                                team._id === submission.teamId,
                                        )?.color,
                                    }}
                                ></div>
                                <div className="grid grid-cols-[1fr_auto] items-center p-2 text-3xl">
                                    <div className="group-data-[rejected=true]:line-through decoration-2 grid grid-cols-2">
                                        <p>
                                            <span className="font-bold tabular-nums">
                                                {SecondsToTimeString(
                                                    submission.seconds,
                                                )}
                                            </span>
                                            <span>{" by "}</span>
                                            <span className="font-bold">
                                                {submission.playerUsername}
                                            </span>
                                        </p>
                                        <p className="font-bold">
                                            <span>{"Score: "}</span>
                                            {submission.score}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
                <li className="not-only:hidden text-center grid place-content-center bg-slate-800 border-4 border-slate-600 h-20">
                    {"No times submitted."}
                </li>
            </ol>
        </div>
    );
}
