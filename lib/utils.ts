import { Camera, Color } from "@/types/canvas";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const COLORS = [
  "teal",
  "indigo",
  "lime",
  "amber",
  "emerald",
  "fuchsia",
  "violet",
  "cyan",
  "sky",
  "sapphire",
  "rose",
  "maroon",
  "olive",
  "navy",
  "teal",
  "mint",
  "peach",
  "carrot",
  "brown"
];
export function connectionIdColor(connectionId: number): string { 
  return COLORS[connectionId % COLORS.length];
}

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera,
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
};

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2,"0")}${color.g.toString(16).padStart(2,"0")}${color.b.toString(16).padStart(2,"0")}`
}