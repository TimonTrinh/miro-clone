"use client";

import { ReactNode } from "react";
import { ClientSideSuspense } from "@liveblocks/react";
import { LiveMap, LiveList, LiveObject } from "@liveblocks/client";
import { Layer } from "@/types/canvas";
import { RoomProvider } from "@/liveblocks.config";


interface RoomProps {
    roomId: string;
    children: React.ReactNode;
    fallback: NonNullable<ReactNode> | null;
}

export const Room = ({
    roomId,
    children, 
    fallback
}:RoomProps) => {
    return (
        <RoomProvider id={roomId}
            initialPresence={{ cursor: null, selection: [], pencilDraft: null, penColor: null }}
            initialStorage={{
                layers: new LiveMap<string, LiveObject<Layer>>(),
                layerIds: new LiveList([]),
            }}
        > 
            <ClientSideSuspense fallback={fallback}>
             {() => children}
            </ClientSideSuspense>
        </RoomProvider>
    );
}