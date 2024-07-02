"use client";

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
            fill={selectionColor}
            stroke="tranparent"
            strokeWidth={1}
            x={x} y={y} width={width} height={height}
        >

        </rect>
    );
}