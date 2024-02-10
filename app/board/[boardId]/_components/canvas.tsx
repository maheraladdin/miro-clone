"use client";
import { Id } from "@/convex/_generated/dataModel";
import { Info } from "@/app/board/[boardId]/_components/info";
import { Toolbar } from "@/app/board/[boardId]/_components/toolbar";
import { Participants } from "@/app/board/[boardId]/_components/participants";

type CanvasProps = {
  boardId: Id<"boards">;
};

export const Canvas = ({ boardId }: CanvasProps) => {
  return (
    <main className={"relative h-full w-full touch-none bg-neutral-100"}>
      <Info boardId={boardId} />
      <Participants />
      <Toolbar />
    </main>
  );
};
