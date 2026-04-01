import { redirect } from "next/navigation";

// Match creation only done with /create/[matchId]
export default function Page() {
    redirect("/");
}
