"use client";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormMessage, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";

type NewBoardButtonProps = {
  orgId: string;
  disabled?: boolean;
};

const titleSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
});

export function NewBoardButton({ orgId, disabled }: NewBoardButtonProps) {
  const { mutate, pending } = useApiMutation(api.board.create);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const form = useForm({
    resolver: zodResolver(titleSchema),
    defaultValues: {
      title: "",
    },
  });

  const { register, handleSubmit, reset } = form;

  const onSubmit = async () => {
    const title = "";
    await mutate({ orgId, title })
      .then(() => {
        toast.success(`Your board "${title}" created successfully! 🎉`);
      })
      .catch(() => {
        toast.error(`Failed to create board "${title}"! 😔`);
      })
      .finally(() => {
        setIsOpened(false);
        reset();
      });
  };

  const onOpenChange = () => {
    if (isOpened) {
      reset();
    }
    setIsOpened(!isOpened);
  };

  return (
    <Dialog open={isOpened} onOpenChange={onOpenChange}>
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
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              {...register("title")}
              render={({ field }) => (
                <FormItem className={"space-y-6"}>
                  <Input
                    {...field}
                    id={"newBoard"}
                    placeholder={"awesome board title"}
                    autoFocus
                  />
                  <FormMessage />
                  <Button variant={"happy"} type={"submit"} disabled={pending}>
                    {pending ? "Creating..." : "Create Board"}
                  </Button>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
