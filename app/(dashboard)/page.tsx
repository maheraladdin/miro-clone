"use client";
import { EmptyOrg } from "./_components/empty-status";
import { useOrganization } from "@clerk/nextjs";
import { BoardList } from "@/app/(dashboard)/_components/board-list";

type DashboardPageProps = {
  searchParams: {
    search?: string;
    favorites?: string;
  };
};

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  const { organization } = useOrganization();
  return (
    <div className={"h-[calc(100%-80px)] flex-1 p-6"}>
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList orgId={organization.id} query={searchParams} />
      )}
    </div>
  );
}
