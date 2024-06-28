"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "convex/react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Hint } from "@/components/hint";
import { useRenameModal } from "@/store/use-rename-modal";
import { Actions } from "@/components/actions";
import { Menu } from "lucide-react";

const font = Poppins({ subsets: ["latin"], weight: ["600"] });

interface InfoProps {
    boardId: string;
}
const TabSeparator = () => {
    return (
        <div className="px-1.5 text-neutral-300">
            |
        </div>
    );
}
export const Info = ({
    boardId
}:InfoProps) => {
    const data = useQuery(api.board.get, { 
        id: boardId as Id<"boards">
    });
    const { onOpen } = useRenameModal();
    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
            <Hint label="Go to boards" side="bottom" sideOffset={10}>
                <Button className="px-2" variant="board">
                    <Link href={"/"} className="flex items-center">
                        <Image 
                        src={"/logo.svg"} 
                        alt={"Board logo"}
                        height={40} width={40}
                        objectFit="centerInside"
                        />
                        <span className={cn("font-semibold text-xl ml-2 text-black", font.className)}>
                            Board
                        </span>
                    </Link>
                </Button>
            </Hint>
            <TabSeparator />
            <Hint label="Rename board" side="bottom" sideOffset={10}>
                <Button variant="board" className="text-base font-normal px-2"
                    onClick={() => onOpen(`${data?._id}`, `${data?.title}`)}
                >
                    {data?.title}
                </Button>
            </Hint>
            <TabSeparator />
            <Actions title={data?.title as string} id={data?._id as string}>
                <div>
                    <Hint label={""} side="bottom" sideOffset={10}>
                        <Button size="icon" variant="board">
                            <Menu />
                        </Button>
                    </Hint>
                </div>
            </Actions>
        </div>
    );
}

export const InfoSkeleton = () => {
    return (
        <div className="absolute top-2 left-2 rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px] bg-white" >
            <Skeleton className="h-full w-full bg-muted-400"/>
        </div>
    );
}