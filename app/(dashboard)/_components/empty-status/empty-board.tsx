import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function EmptyBoard() {
  return (
    <div className={"flex h-full flex-col items-center justify-center"}>
      <Image
        src={"./empty-data.svg"}
        alt={"Empty Data"}
        width={200}
        height={200}
      />
      <h2 className={"mt-6 text-2xl font-semibold"}> No boards yet! 😔</h2>
      <p className={"mt-2 max-w-xs text-center text-sm text-muted-foreground"}>
        Create your first board to get started.
      </p>
      <div className={"mt-6"}>
        <Button size={"lg"}>Create Board</Button>
      </div>
    </div>
  );
}
