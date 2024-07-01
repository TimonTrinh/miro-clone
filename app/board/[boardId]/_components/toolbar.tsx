import { Skeleton } from "@/components/ui/skeleton";
import { Circle, MousePointer2, Pencil, Redo2, Square, StickyNote, TextIcon, Type, Undo2 } from "lucide-react";
import { ToolButton } from "./tool-button";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

interface ToolBarProps {
    canvasState: CanvasState;
    setCanvasState: (canvasState: CanvasState) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const Toolbar = ({
    canvasState,
    setCanvasState,
    undo,
    redo,
    canUndo,
    canRedo
}:ToolBarProps) => { 
    return (
        <div className="absolute top-[50%] -translate-y-[50%] flex flex-col gap-y-4 left-2">
            <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
                <ToolButton
                    icon={MousePointer2}
                    label="Select"
                    onClick={() => setCanvasState({mode: CanvasMode.None})}
                    isActive={canvasState.mode === CanvasMode.None ||
                        canvasState.mode === CanvasMode.Translating ||
                        canvasState.mode === CanvasMode.Resizing ||
                        canvasState.mode === CanvasMode.SelectionNet ||
                        canvasState.mode === CanvasMode.Pressing
                    }
                />
                <ToolButton
                    icon={Type}
                    label="Text"
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting, 
                        layerType: LayerType.Text
                    })}
                    isActive={canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Text
                    }
                />
                <ToolButton
                    icon={StickyNote}
                    label="Sticky Note"
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting, 
                        layerType: LayerType.Note
                    })}
                    isActive={canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Note
                    }
                />
                <ToolButton
                    icon={Square}
                    label="Square"
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting, 
                        layerType: LayerType.Rectangle
                    })}
                    isActive={canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Rectangle
                    }
                />
                <ToolButton
                    icon={Circle}
                    label="Circles"
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting, 
                        layerType: LayerType.Ellipse
                    })}
                    isActive={canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Ellipse
                    }
                />
                <ToolButton
                    icon={Pencil}
                    label="Pen"
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Pencil
                    })}
                    isActive={canvasState.mode === CanvasMode.Pencil}
                />
            </div>
            <div className="bg-white p-1.5 rounded-md flex flex-col shadow-md items-center">
                <ToolButton
                    icon={Undo2}
                    label="Undo"
                    onClick={undo}
                    isDisabled={!canUndo}
                />
                <ToolButton
                    icon={Redo2}
                    label="Redo"
                    onClick={redo}
                    isDisabled={!canRedo}
                />
            </div>
        </div>
    );
}

export const ToolbarSkeleton = () => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] flex flex-col gap-y-4 left-2 bg-white h-[360px] w-[52px] shadow-md rounded-md"/>
    );
}