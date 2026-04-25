import { useState, useRef, useEffect } from "react";

export default function BulkContractDialog({
    ref,
    SubmitContracts,
    CloseDialog,
}: {
    ref: React.Ref<HTMLDialogElement> | undefined;
    SubmitContracts: (input: string) => void;
    CloseDialog: () => void;
}) {
    const [bulkContractInput, setBulkContractInput] = useState("");
    const lineNumbersRef = useRef<HTMLSpanElement>(null);
    const lineMeasureRef = useRef<HTMLSpanElement>(null);
    const bulkContractTextAreaRef = useRef<HTMLTextAreaElement>(null);

    // string variable for representing line numbers in bulk contract form
    // uses invisible span for measuring line length to check for line overflow
    useEffect(() => {
        let lineNumbersText = "";
        const lines = bulkContractInput.split("\n");
        for (let i = 0; i < lines.length; i++) {
            let textAreaLinesUsed = 1;
            if (lineMeasureRef.current && bulkContractTextAreaRef.current) {
                lineMeasureRef.current.textContent = lines[i];
                const lineWidth =
                    lineMeasureRef.current.getBoundingClientRect().width;
                const textAreaWidth =
                    bulkContractTextAreaRef.current.getBoundingClientRect()
                        .width;

                textAreaLinesUsed = Math.ceil(lineWidth / textAreaWidth);
            }
            lineNumbersText += i + 1 + "\n";
            for (let k = 1; k < textAreaLinesUsed; k++) {
                lineNumbersText += "\n";
            }
        }
        if (bulkContractTextAreaRef.current) {
            bulkContractTextAreaRef.current.style.height =
                bulkContractTextAreaRef.current.scrollHeight + "px";
        }

        if (lineNumbersRef.current) {
            lineNumbersRef.current.textContent = lineNumbersText;
        }
    }, [bulkContractInput]);

    return (
        <dialog
            ref={ref}
            closedby="any"
            className="m-auto p-2 bg-slate-800 border-2 border-slate-600 backdrop:bg-slate-950/50 w-full max-w-[min(40rem,95%)] h-100 text-white"
            onClose={() => {
                setBulkContractInput("");
            }}
        >
            <form
                className="flex flex-col gap-2 h-full"
                onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    SubmitContracts(bulkContractInput);
                }}
            >
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-bold">
                        {"Bulk ID Submission"}
                    </h1>
                    <button
                        type="button"
                        className="py-1 px-4 bg-slate-700 hover:underline"
                        onClick={CloseDialog}
                    >
                        {"Close"}
                    </button>
                </div>
                <div className="flex border-2 bg-slate-700 border-slate-600 has-[textarea:focus]:outline-1 outline-offset-1 outline-slate-50 h-full overflow-scroll">
                    <span
                        ref={lineNumbersRef}
                        className="whitespace-pre w-[3ch] text-white py-0.5 h-full text-center"
                        // TODO: Focus other text area when this is clicked
                    ></span>
                    <textarea
                        ref={bulkContractTextAreaRef}
                        className="flex-1 min-h-full resize-none text-black bg-slate-50 p-0.5 outline-none overflow-clip"
                        value={bulkContractInput}
                        onInput={(e: React.InputEvent<HTMLTextAreaElement>) => {
                            setBulkContractInput(e.currentTarget.value);
                        }}
                        placeholder="epic-id,steam-id,playstation-id,xbox-id,switch-id"
                        autoFocus
                    ></textarea>
                    <span
                        ref={lineMeasureRef}
                        id="linemeasurer"
                        className="fixed invisible"
                        aria-hidden
                    >
                        {bulkContractInput}
                    </span>
                </div>
                <button
                    className="py-1 px-8 bg-slate-700 hover:underline place-self-center"
                    type="submit"
                >
                    {"Submit"}
                </button>
            </form>
        </dialog>
    );
}
