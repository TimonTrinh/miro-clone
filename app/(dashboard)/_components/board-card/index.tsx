"use client";

import Link from "next/link";
import Image from "next/image";
import { Overlay } from "./overlay";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { BoardFooter } from "./board-footer";

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
                </div>
                <BoardFooter 
                    isFavorite={isFavorite}
                    title={title}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={() => { } } disabled={false}                />
            </div>
        </Link>
    )
}