import { Camera, Color, Layer, Point, Side, XYWH } from "@/types/canvas";
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

const MIN_RESIZE_WIDTH = 10;
const MIN_RESIZE_HEIGHT = 10;
export function resizeBounds(
  bounds: XYWH, 
  corner: Side, 
  point: Point): XYWH {
  
    const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x);
    result.width = Math.abs(point.x - bounds.x);
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y);
    result.height = Math.abs(point.y - bounds.y);
  }

  return result;
}

export function findIntersectingLayersWithRectangle(
  layerIds: readonly string[], 
  layers: ReadonlyMap<string,Layer>, 
  a: Point, b: Point
) {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };
  const ids = [];

  for(const layerId of layerIds) {
    let layer = layers.get(layerId);
    if (layer == null) continue;

    const { x, y, height, width} = layer;
    if ((rect.x + rect.width > x) && (rect. x < (x +width)) && 
        (rect.y + rect.height) > y && (rect.y < (y + height))
      ) {
        ids.push(layerId);
    }
  }
  return ids;
}