"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { BoardCard } from "./board-card";
import { NewBoardButton } from "./new-board-button";
import { EmptySearch, EmptyFavorites, EmptyData } from "./empty-status";
import { useId } from "react";

type BoardListProps = {
  orgId: string;
  query: {
    search?: string;
    favorites?: boolean;
  };
};

export function BoardList({ orgId, query }: BoardListProps) {
  const data = useQuery(api.boards.get, { orgId });
  const id = useId();

  if (data === undefined) {
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
          <NewBoardButton orgId={orgId} disabled />
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <BoardCard.Skeleton key={`${id}-${i + 1}`} />
            ))}
        </div>
      </div>
    );
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
        <NewBoardButton orgId={orgId} />
        {data?.map((board) => (
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
