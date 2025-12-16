import Styles from "./DND_Denik.module.css";
import { useState, useEffect, useRef } from "react";

function DND_Help() {
  const [sheet, setSheet] = useState(null);
  const [zoom, setZoom] = useState(1);

  const svgRef = useRef(null);
  const selectionRef = useRef({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    selecting: false,
  });

  useEffect(() => {
    // funkce pro načtení JSON
    const fetchFields = () => {
      fetch("/fields.json")
        .then((res) => res.json())
        .then(setSheet)
        .catch((err) => console.error("Chyba při načítání fields.json:", err));
    };

    fetchFields(); // načteme hned při mountu

    const interval = setInterval(fetchFields, 1000); // každých 100ms

    return () => clearInterval(interval); // vyčistíme interval při unmountu
  }, []);

  const handleWheel = (event) => {
    if (event.ctrlKey) {
      event.preventDefault();
      setZoom((prev) => prev - 0.0005 * event.deltaY);
    }
  };

  const startSelection = (event) => {
    const svg = svgRef.current;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    selectionRef.current.startX = svgP.x;
    selectionRef.current.startY = svgP.y;
    selectionRef.current.currentX = svgP.x;
    selectionRef.current.currentY = svgP.y;
    selectionRef.current.selecting = true;
  };

  const updateSelection = (event) => {
    if (!selectionRef.current.selecting) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    selectionRef.current.currentX = svgP.x;
    selectionRef.current.currentY = svgP.y;
  };

  const endSelection = () => {
    if (!selectionRef.current.selecting) return;

    const { startX, startY, currentX, currentY } = selectionRef.current;
    const x = Math.min(startX, currentX);
    const y = Math.min(startY, currentY);
    const w = Math.abs(currentX - startX);
    const h = Math.abs(currentY - startY);

    const fieldObj = {
      id: "xxx",
      x: Math.round(x),
      y: Math.round(y),
      w: Math.round(w),
      h: Math.round(h),
      type: "xxx",
      value: "xxx",
    };

    console.log(JSON.stringify(fieldObj));

    selectionRef.current.selecting = false;
  };

  if (!sheet) return <div className={Styles.loading}>Loading…</div>;

  const { viewBox, fields } = sheet;

  // souřadnice výběru pro zobrazení vizuálního obdélníku
  const sel = selectionRef.current;
  const selX = Math.min(sel.startX, sel.currentX);
  const selY = Math.min(sel.startY, sel.currentY);
  const selW = Math.abs(sel.currentX - sel.startX);
  const selH = Math.abs(sel.currentY - sel.startY);

  return (
    <div className={Styles.viewport} onWheel={handleWheel}>
      <svg
        ref={svgRef}
        onWheel={handleWheel}
        onMouseDown={startSelection}
        onMouseMove={updateSelection}
        onMouseUp={endSelection}
        className={Styles.svg}
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top",
        }}
        width="90vw"
        xmlns="http://www.w3.org/2000/svg"
      >
        <image
          href="/src/assets/DnD-background.png"
          x="0"
          y="0"
          width={viewBox.width}
          height={viewBox.height}
          preserveAspectRatio="xMinYMin meet"
        />

        {fields.map((field) => (
          <foreignObject
            key={field.id}
            id={field.id}
            x={field.x}
            y={field.y}
            width={field.w}
            height={field.h}
          >
            <input
              type={field.type}
              defaultValue={field.value}
              className={Styles.field}
            />
          </foreignObject>
        ))}

        {sel.selecting && (
          <rect
            x={selX}
            y={selY}
            width={selW}
            height={selH}
            fill="rgba(0,0,255,0.3)"
            stroke="blue"
            strokeWidth="1"
          />
        )}
      </svg>
    </div>
  );
}

export default DND_Help;
