"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

import { EmptySearch, EmptyFavorites, EmptyData } from "./empty-status";
import { BoardCard } from "@/app/(dashboard)/_components/board-card";

type BoardListProps = {
  orgId: string;
  query: {
    search?: string;
    favorites?: boolean;
  };
};

export function BoardList({ orgId, query }: BoardListProps) {
  const data = useQuery(api.boards.get, { orgId });

  if (data === undefined) {
    return <div>Loading...</div>;
  }

  if (!data?.length && query.search) {
    return <EmptySearch />;
  }

  if (!data?.length && query.favorites) {
    return <EmptyFavorites />;
  }

  if (!data?.length) {
    return <EmptyData />;
  }

  return (
    <div>
      <h2 className={"text-3xl"}>
        {query.favorites ? "Favorites Boards" : "Team Boards"}
      </h2>
      <div
        className={
          "mt-8 grid grid-cols-1 gap-5 pb-10  sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
        }
      >
        {data.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            authorName={board.authorName}
            authorId={board.authorId}
            createdAt={board._creationTime}
            imageUrl={board.imageUrl}
            orgId={board.orgId}
            isFavorite={false}
          />
        ))}
      </div>
    </div>
  );
}
