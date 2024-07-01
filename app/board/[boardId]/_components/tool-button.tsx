"user client";

import { LucideIcon } from "lucide-react";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface ToolButtonProps {
    label: string;
    icon: LucideIcon;
    isActive?: boolean;
    isDisabled?: boolean;
    onClick: () => void;
}

export const ToolButton = ({
    label, 
    icon: Icon, 
    isActive,
    isDisabled,
    onClick
}: ToolButtonProps) => {
    return (
        <Hint label={label} side="bottom" sideOffset={14}>
            <Button
                variant={isActive? "boardActive" : "board"}
                disabled={isDisabled}
                onClick={onClick}
                size="icon"
            >
                <Icon/>
            </Button>
        </Hint>
    );
}