"use client";

import getStroke from "perfect-freehand";
import { getSvgPathFromStroke } from "@/lib/utils";

interface PathProps {
    x: number;
    y: number;
    points: number[][];
    fill: string;
    onPointerDown?: (e: React.PointerEvent, ) => void;
    stroke?: string;
    cursorValue?: string; 
}

export const Path = ({
    x,y,
    points,
    fill,
    onPointerDown,
    stroke,
    cursorValue
}:PathProps) => {
    return (
        <g>
            <path
                className="drop-shadow-md"
                d={getSvgPathFromStroke(
                    getStroke(points, {
                        size: 16, 
                        smoothing: 0.5,
                        streamline: 0.5,
                        thinning: 0.5
                    })
                )}
                onPointerDown={onPointerDown}
                x={0} y={0}
                fill={fill}
                stroke={stroke}
                strokeWidth={1}
                style={{
                    transform: `translate(${x}px, ${y}px)`,
                    cursor: cursorValue? cursorValue : "default",
                }}
            />
        </g>
    );
}