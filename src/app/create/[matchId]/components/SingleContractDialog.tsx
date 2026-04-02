import { ParseContractId } from "@/lib/ContractUtils";
import { FormatContractLocation } from "@/lib/FormattingUtils";
import { useMemo, useState } from "react";

export default function SingleContractDialog({
    ref,
    SubmitContract,
    CloseDialog,
}: {
    ref: React.Ref<HTMLDialogElement> | undefined;
    SubmitContract: (contract: Contract) => void;
    CloseDialog: () => void;
}) {
    const [epicInput, setEpicInput] = useState("");
    const [steamInput, setSteamInput] = useState("");
    const [playstationInput, setPlaystationInput] = useState("");
    const [xboxInput, setXboxInput] = useState("");
    const [switchInput, setSwitchInput] = useState("");

    const contractLocation = useMemo(() => {
        const parsedLocations: ContractLocation[] = [];
        const epicParsed = ParseContractId(epicInput);
        const steamParsed = ParseContractId(steamInput);
        const playstationParsed = ParseContractId(playstationInput);
        const xboxParsed = ParseContractId(xboxInput);
        const switchParsed = ParseContractId(switchInput);

        if (epicParsed.error === undefined) {
            parsedLocations.push(epicParsed.location);
        }
        if (steamParsed.error === undefined) {
            parsedLocations.push(steamParsed.location);
        }
        if (playstationParsed.error === undefined) {
            parsedLocations.push(playstationParsed.location);
        }
        if (xboxParsed.error === undefined) {
            parsedLocations.push(xboxParsed.location);
        }
        if (switchParsed.error === undefined) {
            parsedLocations.push(switchParsed.location);
        }
        if (
            parsedLocations.length > 0 &&
            parsedLocations.every((loc) => loc === parsedLocations[0])
        ) {
            return parsedLocations[0];
        }
        return undefined;
    }, [epicInput, steamInput, playstationInput, xboxInput, switchInput]);

    function HandleContractSubmit() {
        if (contractLocation === undefined) {
            window.alert("No valid contracts inputted");
            return;
        }
        const epicParsed = ParseContractId(epicInput);
        const steamParsed = ParseContractId(steamInput);
        const playstationParsed = ParseContractId(playstationInput);
        const xboxParsed = ParseContractId(xboxInput);
        const switchParsed = ParseContractId(switchInput);
        const contract: Contract = {
            location: contractLocation,
            epicId: epicParsed.error === undefined ? epicParsed.id : undefined,
            steamId:
                steamParsed.error === undefined ? steamParsed.id : undefined,
            playstationId:
                playstationParsed.error === undefined
                    ? playstationParsed.id
                    : undefined,
            xboxId: xboxParsed.error === undefined ? xboxParsed.id : undefined,
            switchId:
                switchParsed.error === undefined ? switchParsed.id : undefined,
        };
        SubmitContract(contract);
    }

    return (
        <dialog
            ref={ref}
            open
            closedby="any"
            className="m-auto p-2 bg-slate-800 border-2 border-slate-400 backdrop:bg-slate-950/50 w-full max-w-[min(40rem,95%)] text-white"
        >
            <form
                className="flex flex-col gap-2 h-full"
                onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    HandleContractSubmit();
                }}
            >
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-bold">
                        {"Contract Submission"}
                    </h1>
                    <button
                        type="button"
                        className="py-1 px-4 bg-slate-600 hover:underline"
                        onClick={CloseDialog}
                    >
                        {"Close"}
                    </button>
                </div>
                <div className="h-full">
                    <div
                        className="grid border-2 border-slate-400 bg-center"
                        style={{
                            backgroundImage: `${contractLocation !== undefined ? `url(/${contractLocation}_background.webp)` : "none"}`,
                        }}
                    >
                        {contractLocation !== undefined && (
                            <p className="p-1 bg-linear-to-r from-black/90 from-10% via-black/60 via-50% to-transparent">
                                {FormatContractLocation(contractLocation)}
                            </p>
                        )}
                        {contractLocation == undefined && (
                            <p className="p-1 bg-slate-900">
                                {"No Location Found"}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 my-1">
                        <ContractCodeInput
                            value={epicInput}
                            UpdateValue={setEpicInput}
                            platform={"Epic"}
                        />
                        <ContractCodeInput
                            value={steamInput}
                            UpdateValue={setSteamInput}
                            platform={"Steam"}
                        />
                        <ContractCodeInput
                            value={playstationInput}
                            UpdateValue={setPlaystationInput}
                            platform={"PlayStation"}
                        />
                        <ContractCodeInput
                            value={xboxInput}
                            UpdateValue={setXboxInput}
                            platform={"Xbox"}
                        />
                        <ContractCodeInput
                            value={switchInput}
                            UpdateValue={setSwitchInput}
                            platform={"Nintendo Switch"}
                        />
                    </div>
                </div>
                <button
                    className="py-1 px-8 bg-slate-600 hover:underline place-self-center"
                    type="submit"
                >
                    {"Submit"}
                </button>
            </form>
        </dialog>
    );
}

function ContractCodeInput({
    value,
    UpdateValue,
    platform,
}: {
    value: string;
    UpdateValue: (updatedValue: string) => void;
    platform: "Epic" | "Steam" | "PlayStation" | "Xbox" | "Nintendo Switch";
}) {
    function UpdateContractInput(input: string) {
        input = input.trim();
        if (input === "") {
            UpdateValue(input);
            ValidateInput(input);
            return;
        }
        if (!/[0-9-]*/.test(input)) {
            return;
        }
        switch (platform) {
            case "Epic":
            case "Steam":
                if (input[0] !== "1") {
                    return;
                }
                break;
            case "PlayStation":
                if (input[0] !== "2") {
                    return;
                }
                break;
            case "Xbox":
                if (input[0] !== "3") {
                    return;
                }
                break;
            case "Nintendo Switch":
                if (input[0] !== "4") {
                    return;
                }
                break;
        }
        if (input.length > 15) {
            return;
        }
        UpdateValue(input);
        ValidateInput(input);
    }

    const [validationError, setValidationError] = useState("");
    function ValidateInput(input: string) {
        if (input === "") {
            setValidationError("");
            return;
        }
        const parsedContract = ParseContractId(input);
        if (parsedContract.error) {
            setValidationError(parsedContract.error);
            return;
        }
        switch (platform) {
            case "Epic":
            case "Steam":
                if (input[0] !== "1") {
                    setValidationError("Invalid platform ID");
                }
                break;
            case "PlayStation":
                if (input[0] !== "2") {
                    setValidationError("Invalid platform ID");
                }
                break;
            case "Xbox":
                if (input[0] !== "3") {
                    setValidationError("Invalid platform ID");
                }
                break;
            case "Nintendo Switch":
                if (input[0] !== "4") {
                    setValidationError("*Invalid platform ID");
                }
                break;
        }
        setValidationError("");
    }

    let inputPlaceholder = "-XX-XXXXXXX-XX";
    switch (platform) {
        case "Epic":
        case "Steam":
            inputPlaceholder = "1" + inputPlaceholder;
            break;
        case "PlayStation":
            inputPlaceholder = "2" + inputPlaceholder;
            break;
        case "Xbox":
            inputPlaceholder = "3" + inputPlaceholder;
            break;
        case "Nintendo Switch":
            inputPlaceholder = "4" + inputPlaceholder;
            break;
    }

    return (
        <div className="grid ">
            <label className="" htmlFor={`${platform}_id`}>
                {platform}
                <span className="pl-2 text-sm text-red-400">
                    {validationError}
                </span>
            </label>
            <input
                className="w-full px-1 bg-slate-50 text-black border-2 border-slate-400 focus:outline-1 outline-slate-50 focus:outline-double "
                type="text"
                spellCheck={false}
                name={`${platform}_id`}
                value={value}
                onInput={(e: React.InputEvent<HTMLInputElement>) =>
                    UpdateContractInput(e.currentTarget.value)
                }
                placeholder={inputPlaceholder}
            />
        </div>
    );
}
