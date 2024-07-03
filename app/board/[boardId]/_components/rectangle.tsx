"use client";

import { colorToCss } from "@/lib/utils";
import { RectangleLayer } from "@/types/canvas";

interface RectangleProps {
    id: string;
    layer: RectangleLayer;
    onPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor?: string;
    cursorValue?: string;
}

export const Rectangle = ({
    id,
    layer,
    onPointerDown,
    selectionColor = "#007bff",
    cursorValue
}:RectangleProps) => {
    const {x, y, width, height, fill} = layer;

    return (
        <rect className="drop-shadow-md"
            onPointerDown={(e) => onPointerDown(e, id)}
            style={{
                transform: `translate(${x}px, ${y}px)`,
                cursor: cursorValue ? cursorValue : "default",
            }}
            stroke={selectionColor ? selectionColor : "transparent"}
            strokeWidth={2}
            fill={ fill ? colorToCss(fill) : "transparent"}
            x={0} y={0} width={width} height={height}
        >

        </rect>
    );
}