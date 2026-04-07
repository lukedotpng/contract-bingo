import { Id } from "@/../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { ResponseStatus } from "@/lib/globals";

export default async function Page(args: Promise<{ matchId: Id<"match"> }>) {
    const { matchId } = await args;

    const match = useQuery(api.match.getMatch, { matchId });
    if (match == ResponseStatus.NOT_FOUND) return "match doesn't exist!";

    const board = useQuery(api.board.getBoard, { boardId: match!.boardId });
    if (board == ResponseStatus.NOT_FOUND) return "board doesn't exist in this match!";

    const boardContracts = useQuery(api.boardToContract.getAllBTCsFromBoard, { boardId: board!._id });
    if (boardContracts == ResponseStatus.NOT_FOUND) return "board not found!";
}
