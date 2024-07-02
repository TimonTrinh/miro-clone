"use client";

import { colorToCss } from "@/lib/utils";
import { RectangleLayer } from "@/types/canvas";

interface RectangleProps {
    id: string;
    layer: RectangleLayer;
    onPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor?: string;
}

export const Rectangle = ({
    id,
    layer,
    onPointerDown,
    selectionColor = "#007bff",
}:RectangleProps) => {
    const {x, y, width, height, fill} = layer;
    return (
        <rect className="drop-shadow-md"
            onPointerDown={(e) => onPointerDown(e, id)}
            style={{
                transform: `translate(${x}px, ${y}px))`
            }}
            stroke={selectionColor ? selectionColor : "transparent"}
            strokeWidth={2}
            fill={ fill ? colorToCss(fill) : "transparent"}
            x={x} y={y} width={width} height={height}
        >

        </rect>
    );
}