import { Skeleton } from "@/components/ui/skeleton";

export function Toolbar() {
  return (
    <div
      className={
        "absolute left-2 top-1/2 flex -translate-y-1/2 flex-col gap-y-4"
      }
    >
      <div
        className={
          "flex flex-col items-center gap-y-1 rounded-md bg-white p-1.5 shadow-md"
        }
      >
        <div>Pencil</div>
        <div>Square</div>
        <div>Circle</div>
        <div>Ellipsis</div>
      </div>
      <div
        className={
          "flex flex-col items-center gap-y-1 rounded-md bg-white p-1.5 shadow-md"
        }
      >
        <div>Undo</div>
        <div>Redo</div>
      </div>
    </div>
  );
}

export function ToolbarSkeleton() {
  return (
    <div
      className={
        "absolute left-2 top-1/2 flex h-[360px] w-[52px] -translate-y-1/2 flex-col gap-y-4"
      }
    >
      <Skeleton
        className={
          "flex h-2/3 flex-col items-center gap-y-1 rounded-md bg-white p-1.5 shadow-md"
        }
      />
      <Skeleton
        className={
          "flex h-1/3 flex-col items-center gap-y-1 rounded-md bg-white p-1.5 shadow-md"
        }
      />
    </div>
  );
}
