"use client";
import { useCallback, useState } from "react";

import { Info } from "./info";
import { Toolbar } from "./toolbar";
import { Participants } from "./participants";
import { Id } from "@/convex/_generated/dataModel";
import { CursorsPresence } from "./cursors-presence";
import { PointerEventToCanvasPoint } from "@/lib/utils";
import { Camera, CanvasMode, CanvasState } from "@/types/canvas";
import {
  useHistory,
  useCanUndo,
  useCanRedo,
  useMutation,
} from "@/liveblocks.config";

type CanvasProps = {
  boardId: Id<"boards">;
};

export const Canvas = ({ boardId }: CanvasProps) => {
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const { undo, redo } = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

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

  return (
    <main className={"relative h-full w-full touch-none bg-neutral-100"}>
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <svg
        className={"h-screen w-screen"}
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <g>
          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};
