"use client";

import { useApiMutation } from "@/app/hooks/use-api-mutiation";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface NewBoardButtonProps {
    orgId: string,
    disabled?: boolean
}

export const NewBoardButton = ({
    orgId,
    disabled = false,
}: NewBoardButtonProps) => {

    const {mutation, pending} = useApiMutation(api.board.create)
    const onClick = () => {
        mutation({ 
            orgId, 
            title: "Untitled",
        }).then(() => toast.success("New board created!"))
        .catch((error) => toast.error("Failed to create board" + error.message))
    }

    return (
        <button disabled={pending || disabled}
            onClick={onClick}
            className={cn("col-span-1 aspect-[100/120] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
            (pending || disabled) && "opacity-75"
            )}
        >
            <Plus className="text-white h-12 w-12 stroke-1" />
            <p className="text-sm text-white font-light">
                New board
            </p>
            
        </button>
    );
}