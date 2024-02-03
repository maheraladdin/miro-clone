"use client";

import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <div className={"flex items-center gap-x-4 bg-green-500 p-5"}>
      <div className="hidden lg:flex lg:flex-1">{/*  Search  */}</div>
      <UserButton />
    </div>
  );
};
