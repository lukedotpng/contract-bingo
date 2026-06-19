import SubmissionsList from "@/app/components/SubmissionsList";
import { FormatContractLocation } from "@/lib/FormattingUtils";
import { useMutation } from "convex/react";
import { api } from "db/_generated/api";
import { Doc, Id } from "db/_generated/dataModel";

export default function SubmissionSection({
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
    const submissionStatusMutation = useMutation(
        api.scoreSubmission.updateScoreSubmissionResponseStatus,
    );

    function ToggleStatus(
        submissionId: Id<"scoreSubmission">,
        currentStatus: "valid" | "rejected",
    ) {
        submissionStatusMutation({
            status: currentStatus === "valid" ? "rejected" : "valid",
            submissionId: submissionId,
        });
    }

    return (
        <div>
            <p className="font-bold">
                <span>{"Times"}</span>
                <span className="mx-2">{"|"}</span>
                {focusedContractLocation !== undefined && (
                    <span>{`${FormatContractLocation(focusedContractLocation)} (${focusedContractPosition})`}</span>
                )}
                {focusedContractLocation === undefined && (
                    <span>{"All Contracts"}</span>
                )}
            </p>
            <SubmissionsList
                submissions={submissions}
                teams={teams}
                isAdmin
                ToggleStatus={ToggleStatus}
            />
        </div>
    );
}
