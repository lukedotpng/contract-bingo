import { useRef } from "react";

export default function TeamLinksList({ teamLinks }: { teamLinks: string[] }) {
    function CopyLink(link: string): Promise<void> {
        const res = navigator.clipboard.writeText(link);
        return res;
    }

    return (
        <div className="w-full max-w-96">
            <p className="font-bold">{"Team Links"}</p>
            <ul className="w-full">
                {teamLinks.map((teamLink, index) => (
                    <li
                        key={teamLink}
                        className="h-[1.4lh] flex items-center gap-1 mt-1 first:m-0"
                    >
                        <div className="flex flex-1 h-full items-center bg-slate-700 border-2 border-slate-600 has-[input:focus]:border-slate-300">
                            <p className="font-bold w-[2.5ch] text-center border-r-2 border-slate-600">
                                {index + 1}
                            </p>
                            <input
                                type="text"
                                className="flex-1 h-full pl-1 text-ellipsis outline-none"
                                value={teamLink}
                                readOnly
                            />
                        </div>
                        <TeamLinkCopyButton
                            link={teamLink}
                            HandleCopy={CopyLink}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TeamLinkCopyButton({
    link,
    HandleCopy,
}: {
    link: string;
    HandleCopy: (link: string) => Promise<void>;
}) {
    const svgCheckAnimateRef = useRef<SVGAnimateElement>(null);

    return (
        <button
            className="grid h-full aspect-square bg-slate-700 border-2 border-slate-600 hover:border-slate-300"
            onClick={() => {
                const res = HandleCopy(link);
                res.then(() => {
                    svgCheckAnimateRef.current?.beginElement();
                }).catch(() => {
                    console.error("Failed to copy");
                });
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="h-full place-self-center fill-white"
            >
                {/*Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc.*/}
                <path d="M360 160L280 160C266.7 160 256 149.3 256 136C256 122.7 266.7 112 280 112L360 112C373.3 112 384 122.7 384 136C384 149.3 373.3 160 360 160zM360 208C397.1 208 427.6 180 431.6 144L448 144C456.8 144 464 151.2 464 160L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 160C176 151.2 183.2 144 192 144L208.4 144C212.4 180 242.9 208 280 208L360 208zM419.9 96C407 76.7 385 64 360 64L280 64C255 64 233 76.7 220.1 96L192 96C156.7 96 128 124.7 128 160L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 160C512 124.7 483.3 96 448 96L419.9 96z" />
                {/*Just check mark sourced from below*/}
                {/*Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc.*/}
                <path
                    fill="none"
                    d="M410.9 276.6C400.2 268.8 385.2 271.2 377.4 281.9L291.8 399.6L265.3 372.2C256.1 362.7 240.9 362.4 231.4 371.6C221.9 380.8 221.6 396 230.8 405.5L277.2 453.5C282.1 458.6 289 461.3 296.1 460.8C303.2 460.3 309.7 456.7 313.9 451L416.2 310.1C424 299.4 421.6 284.4 410.9 276.6z"
                >
                    <animate
                        ref={svgCheckAnimateRef}
                        attributeName="fill"
                        begin={"indefinite"}
                        dur={"1000ms"}
                        values="transparent;white;white;transparent"
                        keyTimes={"0;.1;1;1"}
                    />
                </path>
            </svg>
        </button>
    );
}
