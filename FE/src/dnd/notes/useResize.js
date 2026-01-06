import { useEffect, useRef } from "react";

export function useResize(boxRef, handleRef) {
  const size = useRef({ width: 0, height: 0 });
  const start = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const box = boxRef.current;
    const handle = handleRef.current;
    if (!box || !handle) return;

    // Nastavit touch action pro mobilní zařízení
    box.style.touchAction = "none";

    const onPointerDown = (e) => {
      // Uložit počáteční hodnoty
      start.current = { x: e.clientX, y: e.clientY };
      size.current = { width: box.offsetWidth, height: box.offsetHeight };

      // Zavěsíme pointer capture pro správné zpracování událostí
      handle.setPointerCapture(e.pointerId);

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    };

    const onPointerMove = (e) => {
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;

      // Změníme velikost boxu podle pohybu myši
      box.style.width = `${size.current.width + dx}px`;
      box.style.height = `${size.current.height + dy}px`;
    };

    const onPointerUp = (e) => {
      // Po dokončení resize aktualizujeme referenci
      size.current = {
        width: box.offsetWidth,
        height: box.offsetHeight,
      };

      // Ukončíme poslouchání událostí
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);

      handle.releasePointerCapture(e.pointerId);
    };

    // Připojíme event listener k uchopovacímu prvku
    handle.addEventListener("pointerdown", onPointerDown);

    return () => {
      handle.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);
}
