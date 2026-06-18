import { useState } from "react";

export default function PlayerJoinDialog({
    AddPlayer,
}: {
    AddPlayer: (username: string, platform: Platform) => void;
}) {
    const [username, setUsername] = useState("");
    const [platform, setPlatform] = useState<Platform | "">("");

    return (
        <dialog
            open
            className="inset-0 m-auto p-2 bg-slate-800 border-2 border-slate-600 backdrop:bg-slate-950/50 w-full max-w-[min(20rem,95%)]  text-white"
        >
            <form
                className="grid"
                onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    if (platform !== "") {
                        AddPlayer(username, platform);
                    }
                }}
            >
                <label htmlFor="username">Username:</label>
                <input
                    className="px-0.5 bg-slate-50 text-black border-2 border-slate-600 focus:outline-1 outline-slate-50 focus:outline-double"
                    required
                    placeholder="username..."
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onInput={(e) => setUsername(e.currentTarget.value)}
                />

                <label htmlFor="platform" className="mt-2">
                    Platform:
                </label>
                <select
                    className="px-0.5 bg-slate-50 text-black border-2 border-slate-600 focus:outline-1 outline-slate-50 focus:outline-double"
                    required
                    name="platform"
                    id="platform"
                    value={platform}
                    onChange={(e) => {
                        setPlatform(e.currentTarget.value as Platform);
                    }}
                >
                    <option value={""} disabled>
                        {"--Select Platform--"}
                    </option>
                    <option value="Epic">Epic</option>
                    <option value="Steam">Steam</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Playstation">PlayStation</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                </select>

                <button
                    type="submit"
                    className="py-1 px-8 bg-slate-600 hover:underline place-self-center mt-4"
                >
                    {"Join Team"}
                </button>
            </form>
        </dialog>
    );
}
