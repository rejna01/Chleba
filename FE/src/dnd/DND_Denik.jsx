import Styles from "./DND_Denik.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import Field from "./Field.jsx";

export default function DND_Denik() {
  const { char } = useParams();

  const [sheet, setSheet] = useState(null);
  const [zoom, setZoom] = useState(1);

  const svgRef = useRef(null);
  const viewportRef = useRef(null);

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    fetch(`/api/fields/${char}`)
      .then((res) => res.json())
      .then(setSheet)
      .catch(console.error);
  }, [char]);

  /* ---------------- ZOOM ---------------- */

  const handleWheel = useCallback((event) => {
    if (!event.ctrlKey) return;

    //event.preventDefault();

    setZoom((prev) => {
      const next = prev - event.deltaY * 0.001;
      return Math.min(Math.max(next, 0.3), 3);
    });
  }, []);

  /* ---------------- DISABLE BROWSER ZOOM ---------------- */

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };

    document.addEventListener("wheel", handler, { passive: false });
    return () => document.removeEventListener("wheel", handler);
  }, []);
  /*useLayoutEffect(() => {
    if (!svgRef.current || !viewportRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    viewportRef.current.style.height = rect.height + "px";
  }, [zoom]);*/
  /* ---------------- RENDER ---------------- */

  if (!sheet) {
    return <div className={Styles.loading}>Loading…</div>;
  }

  const { viewBox, fields } = sheet;

  return (
    <div className={Styles.viewport} onWheel={handleWheel} ref={viewportRef}>
      <svg
        ref={svgRef}
        className={Styles.svg}
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        width="90vw"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "50% 0%",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* BACKGROUND */}
        <image
          href="/src/assets/DnD-background.png"
          x="0"
          y="0"
          width={viewBox.width}
          height={viewBox.height}
          preserveAspectRatio="xMinYMin meet"
        />

        {/* FIELDS */}
        {fields.map((field) => (
          <Field key={field.id} field={field} charId={char} />
        ))}
      </svg>
    </div>
  );
}
