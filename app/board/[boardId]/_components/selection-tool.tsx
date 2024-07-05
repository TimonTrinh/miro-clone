"use client";

import { memo } from "react";
import { Camera, Color } from "@/types/canvas";
import { useSelf } from "@/liveblocks.config";
import { useSelectionBounds } from "@/app/hooks/use-selection-bounds";
import { ColorPicker } from "./color-picker";
import { useMutation } from "@liveblocks/react";
import { useDeleteLayers } from "@/app/hooks/use-delete-layers";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";

interface SelectionToolsProps {
    camera: Camera, 
    setLastUsedColor: (color: Color) => void;
};

export const SelectionTools = memo(({ camera, setLastUsedColor }: SelectionToolsProps) => {

    const selection = useSelf((me) => me.presence.selection);
    const setFill = useMutation((
        {storage}, 
        fill: Color,
    ) => {
        setLastUsedColor(fill); 
        let liveLayers = storage.get("layers");

        selection?.forEach((layerId) => {
            liveLayers.get(layerId)?.set("fill", fill);
        });
        
    }, [selection,setLastUsedColor]);

    const deleteLayers = useDeleteLayers();

    const bringToFront = useMutation((
        { storage, self },
    ) => {
        let liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];
        const arrIds = liveLayerIds.toImmutable();

        for (let i = 0; i < arrIds.length; i++) {
            if (selection?.includes(arrIds[i])) {
                indices.push(i);
            }
        }
        let lastArrayIndex = arrIds.length - 1;
        let lastIndex = indices.length-1;
        for (let i=lastIndex; i >=0; i--) {
            liveLayerIds.move(indices[i], lastArrayIndex - lastIndex + i);
        }

    },[selection]);
    
    const moveToBack = useMutation((
        { storage },
    ) => {
        let liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];
        const arrIds = liveLayerIds.toImmutable();

        for (let i = 0; i < arrIds.length; i++) {
            if (selection?.includes(arrIds[i])) {
                indices.push(i);
            }
        }

        for (let i=0; i < indices.length; i++) {
            liveLayerIds.move(indices[i], i);
        }

    },[selection]);

    const selectionBounds = useSelectionBounds();

    if (!selectionBounds) return null;

    let x = selectionBounds.width/2 + selectionBounds.x + camera.x;
    let y = selectionBounds.y + camera.y;

    return (
        <div 
            className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
            style={{
                transform: `translate(
                    calc(${x}px - 50%),
                    calc(${y}px - 16px - 100%)  
                )`,
            }}
        >
            <ColorPicker 
                onChange={setFill}
            />
            <div className="flex gap-y-0.5">
                <Hint label="Bring to front">
                    <Button
                        variant="board"
                        size="icon"
                        onClick={bringToFront}
                    >
                        <BringToFront/>
                    </Button>
                </Hint>
                <Hint label="Sent to back">
                    <Button
                        variant="board"
                        size="icon"
                        onClick={moveToBack}
                    >
                        <SendToBack/>
                    </Button>
                </Hint>
            </div>
            <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
                <Hint label="Delete" >
                    <Button
                        variant="board"
                        size="icon"
                        onClick={deleteLayers}
                    >
                        <Trash2/>
                    </Button>
                </Hint>
            </div>
        </div>
    );
});

SelectionTools.displayName = "Selection tools";