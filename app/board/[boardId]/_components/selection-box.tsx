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
                     />
                     <rect className="fill-white stroke-1 stroke-blue-500" 
                        style={{
                            cursor: "nwse-resize",
                            transform: `translate(${bound.x+bound.width - HANDLE_WIDTH/2}px, ${bound.y-HANDLE_WIDTH/2}px)`,
                            width: `${HANDLE_WIDTH}`,
                            height: `${HANDLE_WIDTH}`,
                        }}
                     />
                     <rect className="fill-white stroke-1 stroke-blue-500" 
                        style={{
                            cursor: "nwse-resize",
                            transform: `translate(${bound.x - HANDLE_WIDTH/2}px, ${bound.y+bound.height-HANDLE_WIDTH/2}px)`,
                            width: `${HANDLE_WIDTH}`,
                            height: `${HANDLE_WIDTH}`,
                        }}
                     />
                     <rect className="fill-white stroke-1 stroke-blue-500" 
                        style={{
                            cursor: "nwse-resize",
                            transform: `translate(${bound.x+bound.width - HANDLE_WIDTH/2}px, ${bound.y+bound.height-HANDLE_WIDTH/2}px)`,
                            width: `${HANDLE_WIDTH}`,
                            height: `${HANDLE_WIDTH}`,
                        }}
                     />
                </>
            )}
        </>
    );
});

SelectionBox.displayName = "Selection Box";