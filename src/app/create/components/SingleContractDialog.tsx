import { ParseContractId } from "@/lib/ContractUtils";
import { FormatContractLocation } from "@/lib/FormattingUtils";
import { useMemo, useState } from "react";
import ContractIdInput from "./ContractIdInput";

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
            id: crypto.randomUUID(),
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
            closedby="any"
            className="m-auto p-2 bg-slate-800 border-2 border-slate-600 backdrop:bg-slate-950/50 w-full max-w-[min(40rem,95%)] text-white"
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
                        className="grid border-2 border-slate-600 bg-center"
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
                        <ContractIdField
                            value={epicInput}
                            UpdateValue={setEpicInput}
                            platform={"Epic"}
                        />
                        <ContractIdField
                            value={steamInput}
                            UpdateValue={setSteamInput}
                            platform={"Steam"}
                        />
                        <ContractIdField
                            value={playstationInput}
                            UpdateValue={setPlaystationInput}
                            platform={"PlayStation"}
                        />
                        <ContractIdField
                            value={xboxInput}
                            UpdateValue={setXboxInput}
                            platform={"Xbox"}
                        />
                        <ContractIdField
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

function ContractIdField({
    value,
    UpdateValue,
    platform,
}: {
    value: string;
    UpdateValue: (updatedValue: string) => void;
    platform: "Epic" | "Steam" | "PlayStation" | "Xbox" | "Nintendo Switch";
}) {
    return (
        <div className="grid">
            <label htmlFor={`${platform}_id`}>{platform}</label>
            <ContractIdInput
                value={value}
                UpdateValue={UpdateValue}
                contractPlatform={platform}
                className="w-full"
            />
        </div>
    );
}
