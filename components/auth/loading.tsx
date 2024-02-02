import Image from "next/image";

export default function Loading() {
  return (
    <div className={"flex h-screen w-screen items-center justify-center"}>
      <Image
        src="/miro.png"
        alt="miro logo"
        width={120}
        height={120}
        className={"animate-pulse duration-700 ease-in-out"}
      />
    </div>
  );
}
