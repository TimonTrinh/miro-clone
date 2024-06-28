"use client";

import Link from "next/link";
import Image from "next/image";
import { Overlay } from "./overlay";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { BoardFooter } from "./board-footer";
import { Actions } from "@/components/actions";
import { MoreHorizontal } from "lucide-react";
import { useApiMutation } from "@/app/hooks/use-api-mutiation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface BoardCardProps {
    id: string;
    title: string;
    imageUrl: string;
    authorId: string;
    authorName: string;
    createdAt: number;
    orgId: string;
    isFavorite: boolean;
}

export const BoardCard = ({
    id,
    title,
    imageUrl,
    authorId,
    authorName,
    createdAt,
    orgId,
    isFavorite,
}: BoardCardProps) => {

    const {userId } = useAuth();
    const authorLabel = userId === authorId ? "You" : authorName;
    const createdAtLabel  = formatDistanceToNow(createdAt, {
        addSuffix: true
    });
    const { 
        mutation: onFavorite,
        pending: pendingFav } = useApiMutation(api.board.favorite);
    const { 
        mutation: onUnFavorite,
        pending: pendingUnFav } = useApiMutation(api.board.unfavorite);

    const toggleFavorite = () => {
        if (isFavorite) {
            onUnFavorite({id: id})
                .catch(() => toast.error("Failed to unfavorite"));
        } else {
            onFavorite({ id: id,orgId: orgId})
                .catch(() => toast.error("Failed to favorite"));
        }
    }


    return (
        <Link href={`/board/${id}`}>
            <div className="group aspect-[100/120] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-amber-50">
                    <Image
                        src={imageUrl}
                        alt="board" 
                        fill 
                        className="object-fit" 
                    />
                    <Overlay />
                    <Actions 
                        side="right" 
                        title={title} 
                        id={id}                    
                    >
                        <button 
                            className="absolute top-1 right-1 opacity-0
                            group-hover:opacity-100 transition-opacity px-3 py-2 outline-none"
                        >
                            <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity"/>
                        </button>
                    </Actions>
                </div>
                <BoardFooter 
                    isFavorite={isFavorite}
                    title={title}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={toggleFavorite} disabled={pendingFav||pendingUnFav}                />
            </div>
        </Link>
    )
}