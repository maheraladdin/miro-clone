"use client";

import Link from "next/link";

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
  return <Link href={`/board/${id}`}>Loading...</Link>;
}
