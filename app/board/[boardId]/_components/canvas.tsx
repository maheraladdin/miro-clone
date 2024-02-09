import { Info } from "@/app/board/[boardId]/_components/info";
import { Participants } from "@/app/board/[boardId]/_components/participants";
import { Toolbar } from "@/app/board/[boardId]/_components/toolbar";
import { Id } from "@/convex/_generated/dataModel";

type CanvasProps = {
  boardId: Id<"boards">;
};

export const Canvas = ({ boardId }: CanvasProps) => {
  return (
    <main className={"relative h-full w-full touch-none bg-neutral-100"}>
      <Info />
      <Participants />
      <Toolbar />
    </main>
  );
};
