import Image from "next/image";

export default function Loading() {
  return (
    <div className={"flex h-screen w-screen items-center justify-center"}>
      <Image
        src="/miro.svg"
        alt="miro logo"
        width={120}
        height={120}
        className={"animate-pulse rounded-md duration-700 ease-in-out"}
        sizes={"120px"}
      />
    </div>
  );
}
