"use client";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useSelf } from "@/liveblocks.config";
import { useCallback, useState } from "react";
import { CanvasState, CanvasMode, Camera, Color, LayerType, Point } from "@/types/canvas";
import { useHistory, 
    useCanUndo, 
    useCanRedo, 
    useMutation,useStorage,
 } from "@/liveblocks.config";
import { CursorPresence } from "./cursor-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";


const MAX_LAYERS = 50; // max number of layers on the canvas

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
    const [ lastUsedColor, setLastUsedColor] = useState<Color>({
        r:0,g:0,b:0
    })
    const layerIds = useStorage((root) => root.layerIds);
    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const insertLayer = useMutation((
        {storage, setMyPresence}, 
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note, 
        position: Point
    ) => {
        const liveLayers = storage.get("layers");
        if (liveLayers.size >= MAX_LAYERS) return; // Don't allow more than MAX_LAYERS layers

        const liveLayerIds = storage.get("layerIds");
        const layerId = nanoid();
        const layer = new LiveObject({
            type: layerType,
            x: position.x,
            y: position.y,
            height: 100, 
            width: 100, 
            fill: lastUsedColor, 
        });
        liveLayerIds.push(layerId);
        liveLayers.set(layerId, layer);
        setMyPresence({selection: [layerId]}, {addToHistory: true});
        setCanvasState({mode: CanvasMode.None});
    }, [lastUsedColor])

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

    const onPointerUp = useMutation(({}, e) => {
        const point = pointerEventToCanvasPoint(e, camera);
        
        if (canvasState.mode === CanvasMode.Inserting) {
            if (canvasState.layerType !== LayerType.Path) {
                insertLayer(canvasState.layerType, point);
            } else {
                setCanvasState({
                    mode: CanvasMode.Inserting,
                    layerType: LayerType.Path,
                })
            }
        } else {
            setCanvasState({mode: CanvasMode.None})
        }

        history.resume();
    }, [camera, canvasState, insertLayer, history]);

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
                onPointerUp={onPointerUp}
            >
                <g
                    style={{
                        transform: `translate(${camera.x}px, ${camera.y}px)`
                    }}
                >
                    {layerIds.map((layerId) => (
                        <LayerPreview 
                            key={layerId}
                            id={layerId}
                            onLayerPointerDown={() => {}}
                            selectionColor={"#dawdbb"}
                        />
                    ))}
                    <CursorPresence />
                </g>
            </svg>
        </main>
    );
}