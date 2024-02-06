"use client";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";

type NewBoardButtonProps = {
  orgId: string;
  disabled?: boolean;
};

export function NewBoardButton({ orgId, disabled }: NewBoardButtonProps) {
  const { mutate, pending } = useApiMutation(api.board.create);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const onClick = async () => {
    if (inputRef.current) {
      const title = inputRef.current.value;
      if (!title) return;
      await mutate({ orgId, title })
        .then(() => {
          toast.success(`Your board "${title}" created successfully! 🎉`);
        })
        .catch(() => {
          toast.error(`Failed to create board "${title}"! 😔`);
        })
        .finally(() => {
          setIsOpened(false);
        });
    }
  };

  const onKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await onClick();
    }
  };

  return (
    <Dialog open={isOpened} onOpenChange={() => isOpened && setIsOpened(false)}>
      <DialogTrigger
        disabled={pending || disabled}
        className={cn(
          "col-span-1 flex aspect-[100/127] flex-col items-center justify-center rounded-lg bg-amber-300 py-6 hover:bg-amber-500",
          (pending || disabled) &&
            "cursor-not-allowed opacity-75 hover:bg-amber-300",
        )}
        role={"button"}
        onClick={() => setIsOpened(true)}
      >
        <div />
        <Plus className={"h-12 w-12 stroke-1 text-white"} />
        <p className={"text-xs font-light capitalize text-white"}>new board</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <label htmlFor="newBoard"> Create a new board </label>
          </DialogTitle>
        </DialogHeader>
        <div className={"space-y-6"}>
          <Input
            id={"newBoard"}
            placeholder={"awesome board title"}
            ref={inputRef}
            onKeyUp={onKeyUp}
            autoFocus
          />
          <Button disabled={pending} onClick={onClick}>
            {pending ? "Creating..." : "Create Board"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
