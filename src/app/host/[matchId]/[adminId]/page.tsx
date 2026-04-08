import { Id } from "@/../convex/_generated/dataModel";
import Main from "./components/Main";

export default async function Page({
    params,
}: {
    params: Promise<{ matchId: Id<"match">; adminId: string }>;
}) {
    const { matchId, adminId } = await params;

    return <Main matchId={matchId} adminId={adminId} />;
}
