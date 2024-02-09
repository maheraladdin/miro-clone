import { Skeleton } from "@/components/ui/skeleton";

export function Participants() {
  return (
    <div
      className={
        "absolute right-2 top-2 flex h-12 items-center rounded-md bg-white p-3 shadow-md"
      }
    >
      TODO: List of users
    </div>
  );
}

Participants.Skeleton = function ParticipantsSkeleton() {
  return (
    <Skeleton
      className={
        "absolute right-2 top-2 flex h-12 w-[200px] items-center rounded-md bg-white p-3 shadow-md"
      }
    />
  );
};
