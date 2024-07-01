"use client";

import { ClientSideSuspense } from "@liveblocks/react";

import { RoomProvider } from "@/liveblocks.config";
import { ReactNode } from "react";

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
            initialPresence={{cursor: null}}            
        > 
            <ClientSideSuspense fallback={fallback}>
             {() => children}
            </ClientSideSuspense>
        </RoomProvider>
    );
}