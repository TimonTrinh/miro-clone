"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/app/hooks/use-api-mutiation";
import { toast } from "sonner";

export const EmptyBoard = () => {
  const { organization } = useOrganization();
  const { mutation, pending } = useApiMutation(api.board.create);
  const onClick = () => {
    
    if (!organization) return;

    mutation({ 
      orgId: organization.id, 
      title: "New board",
    })
    .then((id) => { 
      toast.success("Board created successfully: " + id); 
    })
    .catch((err) => { toast.error("Failed to create board")});
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
        <Image src="/element.svg" width={110} height={110} 
        alt={"empty board"} />
        <h2 className="text-2xl font-semibold mt-6">Create your first board!</h2>
        <p className="text-muted-foreground text-sm mt-2">Start by creating a board for your organization</p>
        <div className="mt-6">
          <Button disabled={pending} size="lg" onClick={onClick}>Create board</Button>
        </div>
    </div>
  )
};