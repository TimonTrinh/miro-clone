"use client";

import { useSelectionBounds } from "@/app/hooks/use-selection-bounds";
import { useSelf, useStorage } from "@/liveblocks.config";
import { LayerType, Side, XYWH } from "@/types/canvas";
import { memo } from "react";

interface SelectionBoxProps {
    onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(({ 
    onResizeHandlePointerDown,
}: SelectionBoxProps) => {
    let soleLayerId = useSelf((me) => 
        me.presence.selection?.length === 1 ? me.presence.selection[0] : null
    );
    let isShowingHandles = useStorage((root) => 
        soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
    );
    const bound = useSelectionBounds();
    if (!bound) return null;

    return (
        <>
            <rect 
                className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
                style={{
                    transform: `translate(${bound.x}px, ${bound.y}px)`
                }}
                x={0} y={0} 
                width={bound.width} 
                height={bound.height}
            />
            {isShowingHandles && (
                <>
                     <rect className="fill-white stroke-1 stroke-blue-500" 
                        style={{
                            cursor: "nwse-resize",
                            transform: `translate(${bound.x - HANDLE_WIDTH/2}px, ${bound.y-HANDLE_WIDTH/2}px)`,
                            width: `${HANDLE_WIDTH}`,
                            height: `${HANDLE_WIDTH}`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            //TODO: handle resize from top-left corner
                        }}
                     />
                     <rect className="fill-white stroke-1 stroke-blue-500" 
                        style={{
                            cursor: "n-resize",
                            transform: `translate(${bound.x+bound.width/2 - HANDLE_WIDTH/2}px, ${bound.y-HANDLE_WIDTH/2}px)`,
                            width: `${HANDLE_WIDTH}`,
                            height: `${HANDLE_WIDTH}`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            //TODO: handle resize from top-middle corner
                        }}
                     />
                     <rect className="fill-white stroke-1 stroke-blue-500" 
                        style={{
                            cursor: "nesw-resize",
                            transform: `translate(${bound.x+bound.width - HANDLE_WIDTH/2}px, ${bound.y-HANDLE_WIDTH/2}px)`,
                            width: `${HANDLE_WIDTH}`,
                            height: `${HANDLE_WIDTH}`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            //TODO: handle resize from top-right corner
                        }}
                     />
                     <rect className="fill-white stroke-1 stroke-blue-500" 
                        style={{
                            cursor: "e-resize",
                            transform: `translate(${bound.x+bound.width - HANDLE_WIDTH/2}px, ${bound.y+bound.height/2-HANDLE_WIDTH/2}px)`,
                            width: `${HANDLE_WIDTH}`,
                            height: `${HANDLE_WIDTH}`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            //TODO: handle resize from middle-right corner
                        }}
                     />
                     <rect className="fill-white stroke-1 stroke-blue-500" 
                        style={{
                            cursor: "nesw-resize",
                            transform: `translate(${bound.x - HANDLE_WIDTH/2}px, ${bound.y+bound.height-HANDLE_WIDTH/2}px)`,
                            width: `${HANDLE_WIDTH}`,
                            height: `${HANDLE_WIDTH}`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            //TODO: handle resize from bottom-left corner
                        }}
                     />
                     <rect className="fill-white stroke-1 stroke-blue-500" 
                        style={{
                            cursor: "w-resize",
                            transform: `translate(${bound.x - HANDLE_WIDTH/2}px, ${bound.y+bound.height/2-HANDLE_WIDTH/2}px)`,
                            width: `${HANDLE_WIDTH}`,
                            height: `${HANDLE_WIDTH}`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            //TODO: handle resize from middle-left corner
                        }}
                     />
                     <rect className="fill-white stroke-1 stroke-blue-500" 
                        style={{
                            cursor: "nwse-resize",
                            transform: `translate(${bound.x+bound.width - HANDLE_WIDTH/2}px, ${bound.y+bound.height-HANDLE_WIDTH/2}px)`,
                            width: `${HANDLE_WIDTH}`,
                            height: `${HANDLE_WIDTH}`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            //TODO: handle resize from bottom-right corner
                        }}
                     />
                     <rect className="fill-white stroke-1 stroke-blue-500" 
                        style={{
                            cursor: "s-resize",
                            transform: `translate(${bound.x+bound.width/2 - HANDLE_WIDTH/2}px, ${bound.y+bound.height-HANDLE_WIDTH/2}px)`,
                            width: `${HANDLE_WIDTH}`,
                            height: `${HANDLE_WIDTH}`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            //TODO: handle resize from bottom-middle corner
                        }}
                     />
                </>
            )}
        </>
    );
});

SelectionBox.displayName = "Selection Box";