"use client";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useSelf } from "@/liveblocks.config";
import { useState } from "react";
import { CanvasState, CanvasMode } from "@/types/canvas";
import { useHistory, useCanUndo, useCanRedo } from "@/liveblocks.config";


interface CanvasProps { 
    boardId: string;
}

export const Canvas = ({
    boardId
}:CanvasProps) => {
    const userInfo = useSelf((me) => me.info);
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None
    });
    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    return (
        <main
            className="h-full w-full relative bg-neutral-100 touch-none"
        > 
            <Info boardId={boardId}/>
            <Participants boardId={boardId}/>
            <Toolbar 
                canvasState={canvasState} 
                canUndo={canUndo} 
                canRedo={canRedo}
                setCanvasState={setCanvasState} 
                undo={history.undo} 
                redo={history.redo}  />
        </main>
    );
}