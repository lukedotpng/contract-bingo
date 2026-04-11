"use client";

export default function Home() {
    // TODO
    function CreateMatch() {
        console.log("bleh");
    }

    return (
        <>
            <header className="h-15 bg-slate-800 px-4 grid items-center">
                <h1 className="text-xl font-bold">{"Contract Bingo"}</h1>
            </header>
            <main className="mt-5 overflow-clip grid place-content-center">
                <div className="grid grid-rows-3 grid-cols-3 overflow-clip w-200 max-w-screen">
                    <BlankBingoSquare className="hover:bg-green-400" />
                    <BlankBingoSquare className="hover:bg-red-400" />
                    <BlankBingoSquare className="hover:bg-blue-400" />
                    <BlankBingoSquare className="hover:bg-yellow-400" />
                    <a
                        href="/create"
                        className="aspect-square text-2xl bg-slate-700 border-2 border-slate-300 hover:underline content-center text-center"
                    >
                        {"Create match"}
                    </a>
                    <BlankBingoSquare className="hover:bg-green-400" />
                    <BlankBingoSquare className="hover:bg-red-400" />
                    <BlankBingoSquare className="hover:bg-blue-400" />
                    <BlankBingoSquare className="hover:bg-yellow-400" />
                </div>
            </main>
        </>
    );
}

function BlankBingoSquare({ className }: { className: string }) {
    return (
        <div
            className={
                "aspect-square border-2 border-slate-300 nth-[-n+3]:border-t-4 nth-[n+7]:border-b-4 nth-[3n+1]:border-l-4 nth-[3n]:border-r-4 duration-300 " +
                className
            }
        ></div>
    );
}
