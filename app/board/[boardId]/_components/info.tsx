import { Skeleton } from "@/components/ui/skeleton";

interface InfoProps {
    boardId: string;
}

export const Info = ({
    boardId
}:InfoProps) => {
    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
            Info
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