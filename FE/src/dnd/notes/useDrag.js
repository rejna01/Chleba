import { useEffect, useRef } from "react";

export function useDrag(boxRef, handleRef) {
  const position = useRef({ x: 0, y: 0 });
  const start = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const box = boxRef.current;
    const handle = handleRef.current;
    if (!box || !handle) return;

    box.style.touchAction = "none";

    const onPointerDown = (e) => {
      start.current = {
        x: e.clientX,
        y: e.clientY,
      };

      handle.setPointerCapture(e.pointerId);

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    };

    const onPointerMove = (e) => {
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;

      box.style.transform = `translate(
        ${position.current.x + dx}px,
        ${position.current.y + dy}px
      )`;
    };

    const onPointerUp = (e) => {
      position.current.x += e.clientX - start.current.x;
      position.current.y += e.clientY - start.current.y;

      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);

      handle.releasePointerCapture(e.pointerId);
    };

    handle.addEventListener("pointerdown", onPointerDown);

    return () => {
      handle.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);
}
