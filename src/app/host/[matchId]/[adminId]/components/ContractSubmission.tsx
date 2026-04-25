import { ParseBulkContractIds } from "@/lib/ContractUtils";
import { useRef } from "react";
import BulkContractDialog from "./BulkContractDialog";
import SingleContractDialog from "./SingleContractDialog";

export default function ContractSubmission({
    AddSingleContract,
    AddBulkContracts,
}: {
    AddSingleContract: (contract: Contract) => void;
    AddBulkContracts: (contracts: Contract[]) => void;
}) {
    function SubmitContract(contract: Contract) {
        AddSingleContract(contract);
        CloseSingleContractDialog();
    }
    function BulkSubmitContracts(input: string) {
        const parsedContracts = ParseBulkContractIds(input);
        if (parsedContracts.error !== undefined) {
            window.alert(parsedContracts.error);
            console.error(parsedContracts.error);
        } else {
            AddBulkContracts(parsedContracts.contracts);
            CloseBulkContractDialog();
        }
    }

    const singleContractDialogRef = useRef<HTMLDialogElement>(null);
    function ShowSingleContractDialog() {
        if (singleContractDialogRef.current) {
            singleContractDialogRef.current.showModal();
        }
    }
    function CloseSingleContractDialog() {
        if (singleContractDialogRef.current) {
            singleContractDialogRef.current.close();
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
            <p className="font-bold">{"Contracts"}</p>
            <div className="flex font-bold gap-2 ">
                <button
                    className="flex-1 py-2 bg-slate-700 hover:underline"
                    onClick={ShowSingleContractDialog}
                >
                    {"Add"}
                </button>
                <button
                    className="flex-1 py-2 bg-slate-700 hover:underline"
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
            <SingleContractDialog
                ref={singleContractDialogRef}
                SubmitContract={SubmitContract}
                CloseDialog={CloseSingleContractDialog}
            />
        </div>
    );
}
