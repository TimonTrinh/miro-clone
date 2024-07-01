"use client";

import { memo } from "react";
import { useOthersConnectionIds } from "@/liveblocks.config";
import { Cursor } from "./cursor";

const Cursors = () => { 
    const connectionIds = useOthersConnectionIds();

    return (
        <>
            {connectionIds.map((connectionId) => (
                <Cursor
                    key={connectionId}
                    connectionId={connectionId}
                />
            ))}
        </>
    );
}

export const CursorPresence = memo( () => { 
    return (
        <>
            <Cursors />
        </>
    );
});

CursorPresence.displayName = "CursorPresence";