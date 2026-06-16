import { useRef } from "react";
import SingleContractDialog from "./SingleContractDialog";

export default function AddContract({
    AddContract,
}: {
    AddContract: (contract: Contract) => void;
}) {
    function HandleContractSubmit(contract: Contract) {
        AddContract(contract);
        CloseContractDialog();
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
                {"Add"}
            </button>
            <SingleContractDialog
                ref={contractDialogRef}
                SubmitContract={HandleContractSubmit}
                CloseDialog={CloseContractDialog}
            />
        </>
    );
}
