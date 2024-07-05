"use client";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useSelf } from "@/liveblocks.config";
import { useCallback, useMemo, useState, useEffect } from "react";
import { CanvasState, CanvasMode, Camera, Color, LayerType, Point, Side, XYWH } from "@/types/canvas";
import { useHistory, 
    useCanUndo, 
    useCanRedo, 
    useMutation,useStorage,useOthersMapped,
 } from "@/liveblocks.config";
import { CursorPresence } from "./cursor-presence";
import { colorToCss, connectionIdColor, findIntersectingLayersWithRectangle, penPointsToPathLayer, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tool";
import { Path } from "./path";
import { useDisableScrollBound } from "@/app/hooks/use-disable-scroll-bound";
import { useDeleteLayers } from "@/app/hooks/use-delete-layers";


const MAX_LAYERS = 50; // max number of layers on the canvas

interface CanvasProps { 
    boardId: string;
}

export const Canvas = ({
    boardId
}:CanvasProps) => {
    let userInfo = useSelf((me) => me.info);
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None
    });
    const [ camera, setCamera] = useState<Camera>({x: 0, y: 0});
    const [ lastUsedColor, setLastUsedColor] = useState<Color>({
        r:0,g:0,b:0
    })
    const pencilDraft = useSelf((me) => me.presence.pencilDraft);

    let layerIds = useStorage((root) => root.layerIds);
    let history = useHistory();
    let canUndo = useCanUndo();
    let canRedo = useCanRedo();

    useDisableScrollBound();
    const deleteLayers = useDeleteLayers();
    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            switch (event.key) {
                case "z":
                    if (event.ctrlKey || event.metaKey) {
                        if (event.shiftKey) {
                            if (canRedo) history.redo();
                        } else {
                            if (canUndo) {
                                history.undo();
                            }
                        }
                    } 
                    break;
                case "y":
                    if (event.ctrlKey && canRedo) {
                        history.redo();
                    }
                    break;
            }
        }

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };

    },[history, deleteLayers]);

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
    }, [lastUsedColor]);

    const resizeSelectedLayer = useMutation((
        {storage, self},
        point: Point,
    ) => {
        if (canvasState.mode !== CanvasMode.Resizing) return;

        let bounds = resizeBounds(canvasState.initialBounds, canvasState.corner, point);
        let liveLayers = storage.get("layers");
        let layer = self.presence.selection?.[0] ? liveLayers.get(self.presence.selection[0]) : null;

        if (layer) {
            layer.update(bounds);
        }
    }, [canvasState])

    const startDrawing = useMutation((
        {setMyPresence},
        point: Point,
        pressure: number,
    ) => {
        setMyPresence({
            pencilDraft: [[point.x, point.y, pressure]],
            penColor: lastUsedColor,
        });
    }, [lastUsedColor]);

    const insertPath = useMutation((
        {storage, self, setMyPresence },
    ) => {
        const liveLayers = storage.get("layers");
        const {pencilDraft} = self.presence;

        if (pencilDraft == null ||
            pencilDraft.length < 2 ||
            liveLayers.size >= MAX_LAYERS
        ) {
            setMyPresence({pencilDraft: null}); 
            return;
        }

        let id = nanoid();
        liveLayers.set(
            id, 
            new LiveObject(
                penPointsToPathLayer(
                    pencilDraft, 
                    lastUsedColor
                )
            )
        );

        let liveLayerIds = storage.get("layerIds");
        liveLayerIds.push(id);
        setMyPresence({pencilDraft: null});
        setCanvasState({mode: CanvasMode.Pencil});
    },[lastUsedColor]);

    const continueDrawing = useMutation((
        { self, setMyPresence },
        point: Point,
        e: React.PointerEvent,
    ) => {
        const {pencilDraft} = self.presence;
        if (canvasState.mode !== CanvasMode.Pencil ||
            e.buttons !== 1 || 
            pencilDraft == null ) {
            //nothing to draw
            return;
        }
        setMyPresence({
            cursor: point, 
            pencilDraft: 
                pencilDraft.length === 1 &&
                pencilDraft[0][0] === point.x &&
                pencilDraft[0][1] === point.y
                    ? pencilDraft
                    : [...pencilDraft, [point.x,point.y,e.pressure]],
        });
    },[canvasState.mode]);

    const unSelectLayer = useMutation(({self, setMyPresence}) => {
        if (self.presence.selection && self.presence.selection.length > 0) {
            setMyPresence({selection: []}, {addToHistory: true});
        }
    }, []);
    const translateSelectedLayer = useMutation((
        {storage, self},
        point: Point,
    ) => {
        if (canvasState.mode !== CanvasMode.Translating) return;

        let offset = {
            x: point.x - canvasState.current.x,
            y: point.y - canvasState.current.y,
        }
        let liveLayers = storage.get("layers");
        for (let id of self.presence.selection!) {
            let layer = liveLayers.get(id);
            if (layer) {
                layer.update({x: layer.get("x") + offset.x, y: layer.get("y") + offset.y});
            }
        }
        setCanvasState({
            mode: CanvasMode.Translating, 
            current: point,
        });
    }, [canvasState]);

    const startMultiSelection = useCallback((
        current: Point,
        origin: Point,
    ) => {
        if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
            setCanvasState({
                mode: CanvasMode.SelectionNet,
                origin,
                current,
            });
        }
    },[]);

    const updateSelectionNet = useMutation((
        {storage, setMyPresence}, 
        current: Point,
        origin: Point,
    ) => {
        let liveLayers = storage.get("layers").toImmutable();
        setCanvasState({
            mode: CanvasMode.SelectionNet,
            origin,
            current,
        });

        const ids = findIntersectingLayersWithRectangle(layerIds, liveLayers, origin, current);

        setMyPresence({selection: ids});
    },[layerIds]);

    const onResizeHandlePointerDown = useCallback((
        corner: Side,
        initialBounds: XYWH,
    ) => {
        history.pause();
        setCanvasState({
            mode: CanvasMode.Resizing,
            initialBounds,
            corner,
        });
    }, [history]);

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

            if (canvasState.mode === CanvasMode.Pressing) {
                //On pressing down on the canvas
                startMultiSelection(current, canvasState.origin);
            } else if (canvasState.mode === CanvasMode.SelectionNet){
                updateSelectionNet(current, canvasState.origin);
            } else if (canvasState.mode === CanvasMode.Translating){
                //On moving the layer
                translateSelectedLayer(current);
            } else if (canvasState.mode === CanvasMode.Resizing) {
                //On resizing 
                resizeSelectedLayer(current);
            } else if (canvasState.mode === CanvasMode.Pencil) {
                continueDrawing(current,e);
            }

            // Update the cursor position in the server-side state
            setMyPresence({cursor: current});
        },[camera, canvasState, 
            resizeSelectedLayer,
            translateSelectedLayer, 
            startMultiSelection,
            updateSelectionNet,
            continueDrawing,
        ]);
    
    const onPointerLeave = useMutation(({setMyPresence}) => {
        // Clear the cursor position in the server-side state
        setMyPresence({cursor: null});
    }, []);

    const onPointerUp = useMutation(({}, e) => {
        const point = pointerEventToCanvasPoint(e, camera);
        
        if (canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing) {
            unSelectLayer();
            setCanvasState({mode: CanvasMode.None});
        } else if (canvasState.mode === CanvasMode.Pencil) {
            insertPath();
        } else if (canvasState.mode === CanvasMode.Inserting) {
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
    }, [
        camera, canvasState, history, 
        insertLayer, 
        insertPath, 
        unSelectLayer, 
        setCanvasState
    ]);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        const point = pointerEventToCanvasPoint(e, camera);
        if (canvasState.mode === CanvasMode.Inserting) return;
        
        //Case for drawing
        if (canvasState.mode === CanvasMode.Pencil) {
            startDrawing(point, e.pressure);
            return;
        }

        setCanvasState({origin: point, mode: CanvasMode.Pressing});
    },[camera, canvasState.mode, setCanvasState, startDrawing]);

    const onLayerPointerDown = useMutation(( 
        {self, setMyPresence}, 
        e: React.PointerEvent, 
        layerId: string,
    ) => { 
        if (canvasState.mode === CanvasMode.Pencil ||
            canvasState.mode === CanvasMode.Inserting
        ) {
            return;
        }
        history.pause();
        e.stopPropagation();

        const point = pointerEventToCanvasPoint(e, camera);
        if (!self.presence.selection?.includes(layerId)) {
            setMyPresence({selection: [layerId]}, {addToHistory: true});
        }
        setCanvasState({mode: CanvasMode.Translating, current: point});
    }, [canvasState, camera, history, canvasState.mode]);

    let selections = useOthersMapped((other) => other.presence.selection)
    let layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {};

        for (let user of selections) {
            let [ connectionId, selection] = user;
            if (selection) {
                for (const layerId of selection) {
                    layerIdsToColorSelection[layerId] = connectionIdColor(connectionId);
                }
            }
        }
        return layerIdsToColorSelection;
    }, [selections]);

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
            <SelectionTools 
                camera={camera}
                setLastUsedColor={setLastUsedColor} 
            />
            <svg
                className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}
                onPointerDown={onPointerDown}
            >
                <g
                    style={{
                        transform: `translate(${camera.x}px, ${camera.y}py)`
                    }}
                >
                    {layerIds.map((layerId) => (
                        <LayerPreview 
                            key={layerId}
                            id={layerId}
                            onLayerPointerDown={onLayerPointerDown}
                            selectionColor={layerIdsToColorSelection[layerId]??null}
                            cursorValue={canvasState.mode === CanvasMode.Translating ? "move" : "default"}
                        />
                    ))}
                    <SelectionBox 
                        onResizeHandlePointerDown={onResizeHandlePointerDown}
                    />
                    {canvasState.mode === CanvasMode.SelectionNet &&
                     canvasState.current != null && (
                        <rect className="fill-blue-500/5 stroke-blue-500 stroke-1"
                        x={Math.min(canvasState.origin.x,canvasState.current.x)}
                        y={Math.min(canvasState.origin.y,canvasState.current.y)}
                        width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                        height={Math.abs(canvasState.origin.y - canvasState.current.y)}
                        />
                    )
                    }
                    <CursorPresence />
                    {pencilDraft !=null && pencilDraft.length > 0 && (
                        <Path 
                            x={0} 
                            y={0} 
                            fill={colorToCss(lastUsedColor)}
                            points={pencilDraft} 
                            
                        />
                    )}
                </g>
            </svg>
        </main>
    );
}

