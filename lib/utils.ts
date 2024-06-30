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
  "lavender",
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