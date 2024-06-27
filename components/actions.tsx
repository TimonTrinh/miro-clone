'use client';

import { DropdownMenuContentProps, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
 } from "./ui/dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/app/hooks/use-api-mutiation";
import { api } from "@/convex/_generated/api";
import { ConfirmModal } from "./confirm-modal";
import { Button } from "./ui/button";
import { useRenameModal } from "@/store/use-rename-modal";

interface ActionsProps {
    children: React.ReactNode;
    side?: DropdownMenuContentProps["side"];
    sideOffset?: DropdownMenuContentProps["sideOffset"];
    title: string;
    id: string;
}

export const Actions = ({ 
    children, 
    side,
    sideOffset,
    title,
    id 
}: ActionsProps) => { 
    const { mutation, pending } = useApiMutation(api.board.remove); 
    const {onOpen} = useRenameModal();
    const onCopyLink = () => {  
        navigator.clipboard.writeText(`${window.location.origin}/board/${id}`)
            .then(() => toast.success("Link copied"))
            .catch(() => toast.error("Failed to copy link"))
    }
    const onDeleteBoard = () => {  
        mutation({id: id})
            .then(() => toast.success(`Board deleted: ${title}`))
           .catch((e) => toast.error("Failed to delete board: " + e.message))
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side={side} sideOffset={sideOffset} className="w-60"
                onClick={(e) => e.stopPropagation()}
            >
                <DropdownMenuItem className="flex items-center p-2 cursor-pointer" onClick={onCopyLink} >
                    <Link2 className="h-4 w-4 mr-2"/> Copy board's link
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center p-2 cursor-pointer" onClick={() => onOpen(id, title)} >
                    <Pencil className="h-4 w-4 mr-2"/> Rename
                </DropdownMenuItem>
                <ConfirmModal 
                    header={"Delete Board?"} 
                    description="Are you sure you want to delete this board?"
                    disabled={pending}
                    onConfirm={
                            onDeleteBoard
                    }
                >
                    <Button 
                        variant="ghost"
                        className="w-full text-sm p-3 cursor-pointer justify-start font-normal" 
                    >
                        <Trash2 className="h-4 w-4 mr-2"/> Delete
                    </Button>
                </ConfirmModal>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}