"use client";

import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/types/canvas";
import { Rectangle } from "./rectangle";
import { Ellipse } from "./ellipse";
import { Note } from "./note";
import { Text } from "./text";
import { Path } from "./path";
import { colorToCss } from "@/lib/utils";


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
        case LayerType.Path:
            return (
                <Path 
                    key={id}
                    x={layer.x} 
                    y={layer.y} 
                    points={layer.points} 
                    onPointerDown={(e) => onLayerPointerDown(e, id)}
                    stroke={selectionColor ? selectionColor : "black"}                    
                    fill={layer.fill ? colorToCss(layer.fill) : "black"}
                />
            );
        case LayerType.Text:
            return (
                <Text
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            );
        case LayerType.Note: 
            return (
                <Note
                    id={id} 
                    layer={layer} 
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            );
        case LayerType.Ellipse: 
            return (
                <Ellipse 
                    id={id} 
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            );
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