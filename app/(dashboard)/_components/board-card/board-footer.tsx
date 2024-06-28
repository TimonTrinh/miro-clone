import { cn } from "@/lib/utils";
import { Star } from "lucide-react";


interface BoardFooterProps {
    title: string;
    authorLabel: string;
    createdAtLabel: string;
    isFavorite: boolean;
    onClick: () => void;
    disabled: boolean;
}

export const BoardFooter = ({
    title,
    authorLabel,
    createdAtLabel,
    isFavorite,
    onClick,
    disabled,
}: BoardFooterProps) => {
    const handleClick = (
        event: React.MouseEvent<HTMLButtonElement,MouseEvent>
    ) => {
        //To prevent click-to-go on [favorite] button
        event.stopPropagation();
        event.preventDefault();
        onClick();
    };

    return (
        <div className="relative bg-white p-1">
            <p className="text-[13px] truncate max-w-[100%-20px]">
                {title}
            </p>
            <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] truncate text-muted-foreground">
                {authorLabel}, {createdAtLabel}
            </p>
            <button 
                className={cn("absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-blue-600",
                disabled && "cursor-not-allowed opacity-75"                    
                )}
                onClick={handleClick}
                disabled={disabled}
            >
                <Star 
                    className={cn("h-4 w-4", isFavorite && "fill-blue-600 text-blue-600")}
                />
            </button>
        </div>
    );
}