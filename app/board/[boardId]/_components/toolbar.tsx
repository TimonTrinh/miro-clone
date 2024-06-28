import { Skeleton } from "@/components/ui/skeleton";
import { Redo2, Undo2 } from "lucide-react";

export const Toolbar = () => { 
    return (
        <div className="absolute top-[50%] -translate-y-[50%] flex flex-col gap-y-4 left-2">
            <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
                <div>
                    Pencil
                </div>
                <div>
                    Square
                </div>
                <div>
                    Circle
                </div>
            </div>
            <div className="bg-white p-1.5 rounded-md flex flex-col shadow-md items-center">
                <Undo2 />
                <Redo2 />
            </div>
        </div>
    );
}

Toolbar.Skeleton = function ToolbarSkeleton() {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] flex flex-col gap-y-4 left-2 bg-white h-[360px] w-[52px] shadow-md rounded-md"/>
    );
}