"use client";

import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/types/canvas";
import { Rectangle } from "./rectangle";

interface LayerPreviewProps {
    id: string;
    onLayerPointerDown: (e:React.PointerEvent, layerId: string) => void;
    selectionColor: string;
    cursorValue?: string;  //Extended for cursor selection
}

export const LayerPreview = ({
    id,
    onLayerPointerDown,
    selectionColor,
    cursorValue = "default"  //Default cursor for layer previews, extended for cursor selection in canvas.
}: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id))
    if (!layer) return null;

    switch (layer.type) {
        case LayerType.Rectangle: 
            return (
                <Rectangle 
                    id={id} 
                    layer={layer}
                    onPointerDown={onLayerPointerDown} 
                    selectionColor={selectionColor}
                    cursorValue={cursorValue}
                />
            );
        default: 
            console.warn("Layer type not supported");
            return null;
    }
};

LayerPreview.displayName = "Layer Preview";