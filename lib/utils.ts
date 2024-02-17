import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Camera, Color, Point, Side, XYWH } from "@/types/canvas";

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

function rgbChannelToHexChannel(channel: number) {
  return channel.toString(16).padStart(2, "0");
}
export function colorToCSS(color: Color) {
  const red = rgbChannelToHexChannel(color.r);
  const green = rgbChannelToHexChannel(color.g);
  const blue = rgbChannelToHexChannel(color.b);
  return `#${red}${green}${blue}`;
}

export function resizeBounds(bounds: XYWH, corner: Side, point: Point): XYWH {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(bounds.x + bounds.width, point.x);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(bounds.x, point.x);
    result.width = Math.abs(point.x - bounds.x);
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(bounds.y + bounds.height, point.y);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(bounds.y, point.y);
    result.height = Math.abs(point.y - bounds.y);
  }

  return result;
}
