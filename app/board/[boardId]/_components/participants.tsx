"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "./user-avatar";
import { useOthers, useSelf } from "@/liveblocks.config";
import { connectionIdColor } from "@/lib/utils";

const MAX_SHOWN_USERS = 3; 

interface ParticipantsProps {
    boardId: string;
}

export const Participants = ({
    boardId
}:ParticipantsProps) => {
    const users = useOthers();
    const currentUser = useSelf();
    const hasMoreUsers = users.length > MAX_SHOWN_USERS;
    
    return (
        <div className="absolute h-12 top-2 right-2 rounded-md p-3 flex items-center shadow-md bg-white">
            <div className="flex gap-x-2">
                {users.slice(0, MAX_SHOWN_USERS)
                    .map(({connectionId, info}) => {
                        return (
                            <UserAvatar 
                                key={connectionId}
                                src={info?.picture}
                                name={info?.name}
                                fallback={ info?.name?.[0] || "A"}
                                borderColor={connectionIdColor(connectionId) }
                            />
                        );
                    })}

                {currentUser && (
                    <UserAvatar
                        src={currentUser.info?.picture}
                        name={`${currentUser.info?.name} (You)`}
                        fallback={currentUser.info?.name?.[0]}
                        borderColor={connectionIdColor(currentUser.connectionId) }
                    />
                )}
                {hasMoreUsers && (
                    <UserAvatar
                        name={`${users.length - MAX_SHOWN_USERS} more users`}
                        fallback={`+${users.length - MAX_SHOWN_USERS}`}
                    />
                )}
            </div>
        </div>
    );
}

export const ParticipantsSkeleton = () => {
    return (
        <div className="absolute h-12 top-2 right-2 rounded-md p-3 flex items-center shadow-md w-[100px] bg-white">
            <Skeleton className="h-full w-full bg-muted"/>
        </div>
    );
};