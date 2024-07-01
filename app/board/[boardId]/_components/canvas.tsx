"use client";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useSelf } from "@/liveblocks.config";
import { useCallback, useState } from "react";
import { CanvasState, CanvasMode, Camera } from "@/types/canvas";
import { useHistory, 
    useCanUndo, 
    useCanRedo, 
    useMutation,
 } from "@/liveblocks.config";
import { CursorPresence } from "./cursor-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";


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
    const [ camera, setCamera] = useState<Camera>({x: 0, y: 0});

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const onWheel = useCallback((e: React.WheelEvent) => { 
        setCamera((camera) => ({
            x: camera.x - e.deltaX, 
            y: camera.y - e.deltaY,
        }));
    }, []);

    const onPointerMove = useMutation(
        ({setMyPresence}, e: React.PointerEvent) => {
            e.preventDefault();
            const current = pointerEventToCanvasPoint(e, camera);
            // Update the cursor position in the server-side state
            setMyPresence({cursor: current});
        },[]);
    
    const onPointerLeave = useMutation(({setMyPresence}) => {
        // Clear the cursor position in the server-side state
        setMyPresence({cursor: null});
    }, []);

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
            <svg
                className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
            >
                <g>
                    <CursorPresence />
                </g>
            </svg>
        </main>
    );
}