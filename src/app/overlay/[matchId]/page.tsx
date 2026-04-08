import { Id } from "@/../convex/_generated/dataModel";
import Main from "./components/Main";

export default async function Page({
    params,
}: {
    params: Promise<{ matchId: Id<"match"> }>;
}) {
    const { matchId } = await params;

    return <Main matchId={matchId} />;
}
