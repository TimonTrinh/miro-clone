"use client";

import { colorToCss } from "@/lib/utils";
import { Color } from "@/types/canvas";

interface ColorPickerProps {
    onChange: (color: Color) => void;
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
    return (
        <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r gap-x-1 border-neutral-200">
            <ColorButton color={{r: 255,g: 0,b: 0}} onClick={onChange}/>
            <ColorButton color={{r: 0,g: 255,b: 0}} onClick={onChange}/>
            <ColorButton color={{r: 0,g: 0,b: 255}} onClick={onChange}/>
        </div>
    );
}

interface ColorButtonProps { 
    onClick: (color: Color) => void;
    color: Color;
}
const ColorButton = ({ onClick, color}: ColorButtonProps) => {
    return (
        <button className="w-4 h-4 items-center flex justify-center hover:opacity-75 transition gap-0"
            onClick={() => onClick(color)}
        >
            <div className="h-4 w-4 gap-0 rounded-md border border-neutral-300"
                style={{backgroundColor: colorToCss(color)}}
            />
        </button>
    );
}