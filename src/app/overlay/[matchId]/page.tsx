import { Id } from "@/../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ResponseStatus } from "@/lib/globals";

export default async function Page({
    params,
}: {
    params: Promise<{ matchId: Id<"match"> }>;
}) {
    const { matchId } = await params;

    const match = useQuery(api.match.getMatch, { matchId });
    if (match == ResponseStatus.NOT_FOUND) return "match doesn't exist!";

    const board = useQuery(api.board.getBoard, { boardId: match!.boardId });
    if (board == ResponseStatus.NOT_FOUND) return "board doesn't exist in this match!";

    return <p>{"MatchID: " + matchId}</p>;
}
