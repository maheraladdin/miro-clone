"use client";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import React, { useCallback, useState, useMemo } from "react";

import { Info } from "./info";
import { Toolbar } from "./toolbar";
import { Participants } from "./participants";
import { Id } from "@/convex/_generated/dataModel";
import { CursorsPresence } from "./cursors-presence";
import {
  connectionIdColor,
  PointerEventToCanvasPoint,
  resizeBounds,
} from "@/lib/utils";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/types/canvas";
import {
  useHistory,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStorage,
  useOthersMapped,
} from "@/liveblocks.config";
import { LayerPreview } from "@/app/board/[boardId]/_components/layer-preview";
import { useEventListener } from "usehooks-ts";
import { SelectionBox } from "@/app/board/[boardId]/_components/selection-box";

type CanvasProps = {
  boardId: Id<"boards">;
};

const MAX_LAYERS = 100;

export const Canvas = ({ boardId }: CanvasProps) => {
  const layerIds = useStorage((root) => root.layerIds);
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note,
      position: Point,
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
    },
    [lastUsedColor],
  );

  const translateLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) return;

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }

      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState],
  );

  const unSelectLayer = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length <= 0) return;
    setMyPresence({ selection: [] }, { addToHistory: true });
  }, []);

  const resizeLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) return;

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point,
      );

      const liveLayers = storage.get("layers");
      const Layer = liveLayers.get(self.presence.selection[0]);

      if (Layer) {
        Layer.update(bounds);
      }
    },
    [canvasState],
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history],
  );

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const { deltaX, deltaY } = e;
      const { x, y } = camera;

      setCamera({ x: x - deltaX, y: y - deltaY });
    },
    [camera],
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = PointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Translating) {
        translateLayer(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeLayer(current);
      }

      setMyPresence({ cursor: current });
    },
    [canvasState, resizeLayer, camera],
  );

  const onPointerLeave = useMutation(
    ({ setMyPresence }, _) => {
      setMyPresence({ cursor: null });
    },
    [canvasState],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (canvasState.mode === CanvasMode.Inserting) return;
      // TODO: ADD CASE For Drawing
      const point = PointerEventToCanvasPoint(e, camera);
      setCanvasState({ mode: CanvasMode.Pressing, origin: point });
    },
    [camera, canvasState.mode],
  );

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = PointerEventToCanvasPoint(e, camera);

      if (
        canvasState.mode === CanvasMode.Pressing ||
        canvasState.mode === CanvasMode.None
      ) {
        unSelectLayer();
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }

      history.resume();
    },
    [camera, canvasState, history, insertLayer, unSelectLayer],
  );

  const selections = useOthersMapped((other) => other.presence.selection);

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerIds) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      )
        return;

      history.pause();
      e.stopPropagation();

      const point = PointerEventToCanvasPoint(e, camera);

      if (!self.presence.selection.includes(layerIds)) {
        setMyPresence({ selection: [layerIds] }, { addToHistory: true });
      }

      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [setCanvasState, camera, history, canvasState.mode],
  );

  const layerIdsToSelectionColors = useMemo(() => {
    const layerIdsToSelectionColors: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;
      for (const layerId of selection) {
        layerIdsToSelectionColors[layerId] = connectionIdColor(connectionId);
      }
    }

    return layerIdsToSelectionColors;
  }, [selections]);

  const UndoShortcut = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (!canUndo) return;
      if (e.key === "z" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        history.undo();
      }
    },
    [history, canUndo],
  );

  const RedoShortcut = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (!canRedo) return;
      if (
        (e.key === "y" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "z" && (e.metaKey || e.ctrlKey) && e.shiftKey)
      ) {
        history.redo();
      }
    },
    [history, canRedo],
  );

  // on shift + S keydown, deselect all layers
  const deSelectShortcut = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "s" && e.shiftKey) {
        unSelectLayer();
      }
    },
    [unSelectLayer],
  );

  useEventListener("keydown", UndoShortcut);
  useEventListener("keydown", RedoShortcut);
  useEventListener("keydown", deSelectShortcut);

  return (
    <main className={"relative h-full w-full touch-none bg-neutral-100"}>
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={history.undo}
        redo={history.redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <svg
        className={"h-screen w-screen"}
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToSelectionColors[layerId]}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};
