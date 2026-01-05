import { useEffect } from "react";

export function useDrag(boxRef, handleRef) {
  useEffect(() => {
    const box = boxRef.current;
    const handle = handleRef.current;
    if (!box || !handle) return;

    let startX = 0;
    let startY = 0;
    let origX = 0;
    let origY = 0;

    const onPointerDown = (e) => {
      startX = e.clientX;
      startY = e.clientY;

      const rect = box.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);

      e.preventDefault();
    };

    const onPointerMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      box.style.transform = `translate(${origX + dx}px, ${origY + dy}px)`;
    };

    const onPointerUp = () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };

    handle.addEventListener("pointerdown", onPointerDown);
    return () => handle.removeEventListener("pointerdown", onPointerDown);
  }, [boxRef, handleRef]);
}
