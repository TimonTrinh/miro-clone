'use client';

import {
    AlertDialog,
    AlertDialogAction, 
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader, 
    AlertDialogTrigger,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
    children: React.ReactNode;
    disabled?: boolean;
    header: string;
    description?: string;
    onConfirm: () => void;
};
export const ConfirmModal = ({ 
    children, 
    header, 
    description, 
    disabled,
    onConfirm
}: ConfirmModalProps) => {
    const onConfirmed = () => {
        onConfirm();
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {header}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    {description}
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                     <AlertDialogAction 
                        disabled={disabled}
                        onClick={onConfirmed}>
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}