import { ParseContractId } from "@/lib/ContractUtils";

export default function ContractIdInput({
    value,
    UpdateValue,
    contractPlatform,
    className,
}: {
    value: string;
    UpdateValue: (newValue: string) => void;
    contractPlatform:
        | "Epic"
        | "Steam"
        | "PlayStation"
        | "Xbox"
        | "Nintendo Switch";
    className?: string;
}) {
    function UpdateContractInput(e: React.InputEvent<HTMLInputElement>) {
        const input = e.currentTarget.value.trim();
        e.currentTarget.setCustomValidity(ValidateInput(input));

        if (input === "") {
            UpdateValue(input);
            return;
        }
        if (!/[0-9-]*/.test(input)) {
            return;
        }
        switch (contractPlatform) {
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
    }

    function ValidateInput(input: string): string {
        if (input === "") {
            return "";
        }
        const parsedContract = ParseContractId(input);
        if (parsedContract.error) {
            return parsedContract.error;
        }
        switch (contractPlatform) {
            case "Epic":
            case "Steam":
                if (input[0] !== "1") {
                    return "Invalid platform ID";
                }
                break;
            case "PlayStation":
                if (input[0] !== "2") {
                    return "Invalid platform ID";
                }
                break;
            case "Xbox":
                if (input[0] !== "3") {
                    return "Invalid platform ID";
                }
                break;
            case "Nintendo Switch":
                if (input[0] !== "4") {
                    return "Invalid platform ID";
                }
                break;
        }
        return "";
    }

    let inputPlaceholder = "-XX-XXXXXXX-XX";
    switch (contractPlatform) {
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
        <input
            className={`px-0.5 bg-slate-50 text-black border-2 border-slate-600 focus:outline-1 outline-slate-50 focus:outline-double ${className}`}
            type="text"
            spellCheck={false}
            name={`${contractPlatform}_id`}
            value={value}
            onInput={UpdateContractInput}
            placeholder={inputPlaceholder}
        />
    );
}
