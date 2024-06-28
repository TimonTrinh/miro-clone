

import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
    secret: "sk_prod_TK5tviB1AVegbAIOhQQE_770tzVOOlSRsUh5HjCRQSf7Swfw5gcAfP7_gdlyMk2k",

});

export async function POST (request: Request) {
    const authentication = await auth();
    const user = await currentUser();

    if (!authentication || !user) {
        return new Response("Unauthorized", { status: 403 });
    }

    const { room } = await request.json();
    const board = await convex.query(api.board.get, {id: room});
    console.log ("Room & Board", {
        room, board, 
        boardOrgId: board?.orgId, 
        userOrgId: authentication.orgId,
    })

    if (board?.orgId != authentication.orgId) {
        return new Response("Unauthorized");
    }

    const userInfo = {
        name: user.fullName || "Anonymous",
        picture: user.imageUrl!
    }

    const session = liveblocks.prepareSession(
        user.id, 
        { userInfo } 
    )
    console.log({userInfo});
    
    if (room) {
        session.allow(room, session.FULL_ACCESS);
    }

    const { status, body} = await session.authorize();
    console.log({status, body}, "Allowed");
    return new Response(body, {status});
}