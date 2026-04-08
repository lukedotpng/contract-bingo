"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    let errorMessage = "Failed to load the page";
    if (error.message && !error.message.toLowerCase().includes("convex")) {
        errorMessage = error.message;
    }

    return (
        <main className="grid h-screen place-content-center text-center gap-3 text-lg">
            <h1 className="text-3xl font-bold text-red-400">{"ERROR"}</h1>
            <p>{errorMessage}</p>
            <button
                className="w-50 py-3 bg-slate-700 border-2 border-slate-300 hover:underline place-self-center"
                onClick={() => reset()}
            >
                {"Retry"}
            </button>
        </main>
    );
}
