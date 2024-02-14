"use client";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import React, { useCallback, useState } from "react";

import { Info } from "./info";
import { Toolbar } from "./toolbar";
import { Participants } from "./participants";
import { Id } from "@/convex/_generated/dataModel";
import { CursorsPresence } from "./cursors-presence";
import { PointerEventToCanvasPoint } from "@/lib/utils";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
} from "@/types/canvas";
import {
  useHistory,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStorage,
} from "@/liveblocks.config";
import { LayerPreview } from "@/app/board/[boardId]/_components/layer-preview";
import { useEventListener } from "usehooks-ts";

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

      setMyPresence({ cursor: current });
    },
    [canvasState],
  );

  const onPointerLeave = useMutation(
    ({ setMyPresence }, _) => {
      setMyPresence({ cursor: null });
    },
    [canvasState],
  );

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = PointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }

      history.resume();
    },
    [camera, canvasState, history, insertLayer],
  );

  useEventListener("keydown", UndoShortcut);
  useEventListener("keydown", RedoShortcut);

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
              onLayerPointerDown={() => {}}
              selectionColor={"#000"}
            />
          ))}
          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};
