'use client';

import { DropdownMenuContentProps, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
 } from "./ui/dropdown-menu";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

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
    const onCopyLink = () => {  
        navigator.clipboard.writeText(`${window.location.origin}/board/${id}`)
            .then(() => toast.success("Link copied"))
            .catch(() => toast.error("Failed to copy link"))
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
                {/* <button className="text-muted-foreground">
                    {title}
                </button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side={side} sideOffset={sideOffset} className="w-60"
                onClick={(e) => e.stopPropagation()}
            >
                <DropdownMenuItem className="p-2 cursor-pointer" onClick={onCopyLink} >
                    <Link2 className="h-4 w-4 mr-2"/> Copy board's link
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}