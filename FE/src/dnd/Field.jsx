import Styles from "./DND_Denik.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";

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

function RadioCheckbox({ checked, setChecked, charId, id }) {
  const toggle = () => {
    const newChecked = !checked;
    setChecked(newChecked);

    fetch(`/api/fields`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: charId,
        nameOfField: id,
        value: newChecked ? 1 : 0,
      }),
    }).catch(console.error);
  };

  return (
    <div
      className={Styles.radioCheckbox}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => e.key === " " && toggle()}
    >
      <span className={Styles.customRadio} data-checked={checked} />
    </div>
  );
}

export default function Field({ field, charId }) {
  const editableRef = useRef(null);
  const lastValue = useRef(field.value ?? "");
  const [checked, setChecked] = useState(
    field.type === "checkbox" ? !!parseInt(field.value) : false //
  );

  const [fontSize, setFontSize] = useState(
    field.h < 50 ? field.h / LINE_HEIGHT : 12
  );

  const MIN_FONT_SIZE = 6;

  const adjustFontSize = () => {
    const el = editableRef.current;
    if (!el) return;

    let size = fontSize;
    el.style.fontSize = `${size}px`;

    while (
      (el.scrollWidth > el.offsetWidth || el.scrollHeight > el.offsetHeight) &&
      size > MIN_FONT_SIZE
    ) {
      size -= 1;
      el.style.fontSize = `${size}px`;
    }

    setFontSize(size);
  };

  useEffect(() => {
    if (!editableRef.current) return;

    editableRef.current.innerText = field.value ?? "";
    adjustFontSize();
  }, [field.value]);

  const handleInput = () => {
    adjustFontSize();
  };

  const handleBlur = (e) => {
    const newValue = e.target.innerText;
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
      {field.type === "checkbox" ? (
        <RadioCheckbox
          checked={checked}
          setChecked={setChecked}
          charId={charId}
          id={field.id}
        />
      ) : (
        <div
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onInput={handleInput}
          onBlur={handleBlur}
          className={Styles.field}
          style={{
            textAlign: field.type == "number" ? "center" : "left",
            fontSize: `${fontSize}px`,
            lineHeight: LINE_HEIGHT,
            overflow: "hidden",
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </foreignObject>
  );
}
