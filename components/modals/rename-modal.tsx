"use client";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRenameModal } from "@/store/use-rename-modal";
import { FormEventHandler, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useApiMutation } from "@/app/hooks/use-api-mutiation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export const RenameModal = () => {
    const { 
        isOpen, 
        onClose, 
        initialValues, 
    } = useRenameModal( );

    const [title, setTitle] = useState(initialValues.title);
    const {mutation, pending} = useApiMutation(api.board.rename);

    useEffect(() => {
        setTitle(initialValues.title);
    },[initialValues.title]);

    const onSubmit:FormEventHandler<HTMLFormElement> = (
        e
    ) => {
        e.preventDefault();
        
        mutation({ 
            id: initialValues.id,
            title: title,
        }).then(() => { 
            toast.success("Board renamed");
            onClose();
        })
        .catch((e) => {
            toast.error("Failed to rename board " + e.message);  // Handle error here
            onClose();  // Close dialog on error if needed  // Example: onClose();  // Commented out for brevity, uncomment as needed.  // Example: onClose();  // Uncommented out for brevity, uncomment as needed.   // Example: onClose();  // Uncommented out for brevity, uncomment as needed.   // Example: onClose();  // Uncommented out for brevity, uncomment as needed.   // Example: onClose();  // Uncommented out for brevity, uncomment as needed.   // Example: onClose();  // Uncommented out for brevity, uncomment as needed.   // Example: onClose();  // Uncommented out for brevity, uncomment as needed.   // Example: onClose();  // Uncommented out for brevity, uncomment as needed.   // Example: onClose();  // Uncommented out for brevity
        })
        
    }

    return (
        <Dialog open= {isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit board title
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Enter new title for this board
                </DialogDescription>
                <form onSubmit={onSubmit} className="space-y-4"> 
                    <Input 
                        disabled={pending} 
                        required
                        maxLength={60}
                        value={title}
                        placeholder="Board title"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={pending}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}