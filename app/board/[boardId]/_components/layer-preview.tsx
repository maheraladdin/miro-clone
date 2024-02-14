import React, { memo } from "react";
import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/types/canvas";
import { Rectangle } from "@/app/board/[boardId]/_components/rectangle";

type LayerPreviewProps = {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
};

export const LayerPreview = memo(
  ({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) return null;

    switch (layer.type) {
      case LayerType.Rectangle:
        return (
          <Rectangle
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Ellipse:
        return (
          <circle
            cx={layer.x + layer.width / 2}
            cy={layer.y + layer.height / 2}
            r={Math.min(layer.width, layer.height) / 2}
            fill={selectionColor}
            onPointerDown={(e) => onLayerPointerDown(e, id)}
          />
        );
      default:
        console.warn("Unknown layer type", layer);
        return null;
    }
  },
);

LayerPreview.displayName = "LayerPreview";
