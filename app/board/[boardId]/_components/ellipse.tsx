"use client";

import { colorToCss } from "@/lib/utils";
import { EllipseLayer } from "@/types/canvas";

interface EllipseProps {
    id: string;
    layer: EllipseLayer;
    onPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor?: string;
    cursorValue?: string;
}

export const Ellipse = ({
    id,
    layer,
    onPointerDown,
    selectionColor = "#007bff",
    cursorValue
}:EllipseProps) => {
    const {x, y, width, height, fill} = layer;

    return (
        <ellipse className="drop-shadow-md"
            onPointerDown={(e) => onPointerDown(e, id)}
            style={{
                transform: `translate(${x}px, ${y}px)`,
                cursor: cursorValue ? cursorValue : "default",
            }}
            cx={width/2} cy={height/2}
            rx={width/2} ry={height/2}
            stroke={selectionColor ? selectionColor : "transparent"}
            strokeWidth={2}
            fill={ fill ? colorToCss(fill) : "transparent"}
        >

        </ellipse>
    );
}