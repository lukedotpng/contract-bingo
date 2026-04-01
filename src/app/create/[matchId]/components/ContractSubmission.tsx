import { ParseBulkContractIds } from "@/lib/ContractUtils";
import { useRef } from "react";
import BulkContractDialog from "./BulkContractDialog";

export default function ContractIdUpload({
    AddContracts,
}: {
    AddContracts: (contracts: Contract[]) => void;
}) {
    function BulkSubmitContracts(input: string) {
        const parsedContracts = ParseBulkContractIds(input);
        if (parsedContracts.error !== undefined) {
            window.alert(parsedContracts.error);
            console.error(parsedContracts.error);
        } else {
            AddContracts(parsedContracts.contracts);
            CloseBulkContractDialog();
        }
    }

    const bulkContractDialogRef = useRef<HTMLDialogElement>(null);
    function ShowBulkContractDialog() {
        if (bulkContractDialogRef.current) {
            bulkContractDialogRef.current.showModal();
        }
    }
    function CloseBulkContractDialog() {
        if (bulkContractDialogRef.current) {
            bulkContractDialogRef.current.close();
        }
    }

    return (
        <div>
            <p className="font-bold">{"Contract IDs"}</p>
            <div className="flex font-bold max-w-96 w-full gap-2">
                <button className="flex-1 py-2 bg-slate-600 hover:underline">
                    {"Add"}
                </button>
                <button
                    className="flex-1 py-2 bg-slate-600 hover:underline"
                    onClick={ShowBulkContractDialog}
                >
                    {"Bulk Add"}
                </button>
            </div>
            <BulkContractDialog
                ref={bulkContractDialogRef}
                SubmitContracts={BulkSubmitContracts}
                CloseDialog={CloseBulkContractDialog}
            />
        </div>
    );
}
