import { EmptySearch, EmptyFavorites, EmptyData } from "./empty-status";

type BoardListProps = {
  orgId: string;
  query: {
    search?: string;
    favorites?: boolean;
  };
};

export function BoardList({ orgId, query }: BoardListProps) {
  const data = [];

  if (!data?.length && query.search) {
    return <EmptySearch />;
  }

  if (!data?.length && query.favorites) {
    return <EmptyFavorites />;
  }

  if (!data?.length) {
    return <EmptyData />;
  }

  return <div>{JSON.stringify(query, null, 2)}</div>;
}
