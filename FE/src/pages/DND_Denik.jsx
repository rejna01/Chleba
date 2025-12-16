import Styles from "./DND_Denik.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { ne } from "@faker-js/faker";

const LINE_HEIGHT = 1.2;

function SafeSpan({ htmlString }) {
  const match = htmlString.match(/<span(.*?)>(.*?)<\/span>/);
  if (!match) return htmlString;

  const attrsString = match[1].trim();
  const attrs = {};

  // Parse atributy
  attrsString.replace(/(\w+)="(.*?)"/g, (_, key, value) => {
    if (key === "style") {
      // Převést style string na objekt
      const styleObj = {};
      value.split(";").forEach((pair) => {
        const [prop, val] = pair.split(":");
        if (prop && val) {
          const camelProp = prop
            .trim()
            .replace(/-([a-z])/g, (_, char) => char.toUpperCase());
          styleObj[camelProp] = val.trim();
        }
      });
      attrs.style = styleObj;
    } else {
      attrs[key] = value;
    }
  });

  return <span {...attrs}>{match[2]}</span>;
}

function Field({ field, charId }) {
  const fontSize = field.h < 50 ? field.h / LINE_HEIGHT : 10;
  const lastValue = useRef(field.value ?? "");
  const editableRef = useRef(null);

  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.innerText = field.value ?? "";
    }
  }, [field.value]);

  const handleBlur = (e) => {
    const newValue = e.target.innerText;
    console.log(newValue);

    // nic se nezměnilo → neposílej request
    if (newValue === lastValue.current) return;

    lastValue.current = newValue;

    fetch(`/api/fields`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: charId,
        nameOfField: field.id,
        value: newValue,
      }),
    }).catch(console.error);
  };

  return (
    <foreignObject x={field.x} y={field.y} width={field.w} height={field.h}>
      <div
        ref={editableRef}
        className={Styles.field}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onBlur={handleBlur}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: LINE_HEIGHT,
        }}
      >
        {/*<SafeSpan htmlString={field.value} field.value/>*/}
      </div>
    </foreignObject>
  );
}

export default function DND_Denik() {
  const { char } = useParams();

  const [sheet, setSheet] = useState(null);
  const [zoom, setZoom] = useState(1);

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

    event.preventDefault();

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

  /* ---------------- RENDER ---------------- */

  if (!sheet) {
    return <div className={Styles.loading}>Loading…</div>;
  }

  const { viewBox, fields } = sheet;

  return (
    <div className={Styles.viewport} onWheel={handleWheel}>
      <svg
        className={Styles.svg}
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        width="90vw"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
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
