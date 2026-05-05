import { ParseBulkContractIds } from "@/lib/ContractUtils";
import { useRef } from "react";
import BulkContractDialog from "./BulkContractDialog";

export default function BulkAddContracts({
    AddContracts,
}: {
    AddContracts: (contracts: Contract[]) => void;
}) {
    function HandleContractsSubmit(input: string) {
        const parsedContracts = ParseBulkContractIds(input);
        if (parsedContracts.error !== undefined) {
            window.alert(parsedContracts.error);
            console.error(parsedContracts.error);
        } else {
            AddContracts(parsedContracts.contracts);
            CloseContractDialog();
        }
    }

    const contractDialogRef = useRef<HTMLDialogElement>(null);
    function ShowContractDialog() {
        if (contractDialogRef.current) {
            contractDialogRef.current.showModal();
        }
    }
    function CloseContractDialog() {
        if (contractDialogRef.current) {
            contractDialogRef.current.close();
        }
    }

    return (
        <>
            <button
                className="flex-1 py-2 bg-slate-700 hover:underline"
                onClick={ShowContractDialog}
            >
                {"Bulk Add"}
            </button>
            <BulkContractDialog
                ref={contractDialogRef}
                SubmitContracts={HandleContractsSubmit}
                CloseDialog={CloseContractDialog}
            />
        </>
    );
}
