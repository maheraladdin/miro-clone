"use client";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/nextjs";

import Link from "next/link";
import Image from "next/image";
import { Overlay } from "./overlay";
import { Footer } from "@/app/(dashboard)/_components/board-card/footer";
import { Skeleton } from "@/components/ui/skeleton";

type BoardCardProps = {
  id: string;
  title: string;
  authorName: string;
  authorId: string;
  createdAt: number;
  imageUrl: string;
  orgId: string;
  isFavorite: boolean;
};

export function BoardCard({
  id,
  title,
  authorName,
  authorId,
  createdAt,
  imageUrl,
  orgId,
  isFavorite,
}: BoardCardProps) {
  const { userId } = useAuth();

  const authorLabel = authorId === userId ? "You" : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });
  return (
    <Link href={`/board/${id}`}>
      <div
        className={
          "group flex aspect-[100/127] flex-col justify-between overflow-hidden rounded-lg border"
        }
      >
        <div className={"relative flex-1 bg-amber-50"}>
          <Image src={imageUrl} alt={title} fill className={"object-fit"} />
          <Overlay />
        </div>
        <Footer
          title={title}
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          isFavorite={isFavorite}
          onClick={() => {}}
          disabled={false}
        />
      </div>
    </Link>
  );
}

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className={"aspect-[100/127] overflow-hidden rounded-lg"}>
      <Skeleton className={"h-full w-full bg-amber-100"} />
    </div>
  );
};
