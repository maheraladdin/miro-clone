import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Camera } from "@/types/canvas";

const randomColors = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#800080",
  "#FFC0CB",
  "#FFD700",
  "#FF4500",
  "#FF8C00",
  "#FF1493",
  "#FF69B4",
  "#FF6347",
  "#FF7F50",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function connectionIdColor(connectionId: number) {
  return randomColors[connectionId % randomColors.length];
}

export function PointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera,
): Camera {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}
