"use client";

import { memo } from "react";
import { Camera, Color } from "@/types/canvas";
import { useSelf } from "@/liveblocks.config";
import { useSelectionBounds } from "@/app/hooks/use-selection-bounds";

interface SelectionToolsProps {
    camera: Camera, 
    setLastUsedColor: (color: Color) => void;
};

export const SelectionTools = memo(({ camera, setLastUsedColor }: SelectionToolsProps) => {

    let selection = useSelf((me) => me.presence.selection);
    let selectionBounds = useSelectionBounds();

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
            My tools
        </div>
    );
});

SelectionTools.displayName = "Selection tools";