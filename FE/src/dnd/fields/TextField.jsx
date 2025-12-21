import { useEffect, useRef, useState } from "react";
import Styles from "./TextField.module.css";

const LINE_HEIGHT = 1.2;
const MIN_FONT_SIZE = 6;

function findSpellByName(data, name) {
  if (!data || !Array.isArray(data.spell)) return null;
  return data.spell.find((spell) => spell.name === name) || null;
}

function AddTooltip({ data, text, setTooltip, setTooltipSpell }) {
  const spell = findSpellByName(data, text);
  if (!spell) return <span>{text}</span>;
  return (
    <span
      onMouseEnter={() => {
        setTooltip(true);
        setTooltipSpell(spell);
      }}
      onMouseLeave={() => setTooltip(false)}
    >
      {text}
    </span>
  );
}

export default function TextField({
  field,
  saveField,
  editable,
  spellsXPHB,
  setTooltip,
  setTooltipSpell,
}) {
  const [editing, setEditing] = useState(false);
  const [fontSize, setFontSize] = useState(field.h < 50 ? field.h / 1.2 : 12);

  const editableRef = useRef(null);
  const tooltipRef = useRef(null);
  const lastValue = useRef(field.value ?? "");

  const adjustFontSize = (el) => {
    if (!el) return;

    let min = MIN_FONT_SIZE;
    let max = field.h < 50 ? field.h / 1.2 : 12;
    let bestSize = min;

    while (min <= max) {
      const mid = Math.floor((min + max) / 2);
      el.style.fontSize = `${mid}px`;

      // force reflow
      el.getBoundingClientRect();

      if (
        el.scrollWidth <= el.offsetWidth &&
        el.scrollHeight <= el.offsetHeight
      ) {
        bestSize = mid;
        min = mid + 1; // můžeme zkusit větší
      } else {
        max = mid - 2; // zmenšíme font
      }
    }

    el.style.fontSize = `${bestSize}px`;
    setFontSize(bestSize);
  };

  const adjustEditingFontSize = (e) => {
    const el = e.target;
    if (!el || el.innerText === lastValue.current) return;
    adjustFontSize(el);
  };

  useEffect(() => {
    const el = editableRef.current;
    if (!el || !editing) return;

    el.focus();
    adjustFontSize(el);

    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }, [editing]);

  useEffect(() => {
    adjustFontSize(tooltipRef.current);
  }, [field.value]);

  const handleBlur = (e) => {
    setEditing(false);
    const newValue = e.currentTarget.innerText;
    if (newValue !== lastValue.current) {
      saveField(field.id, newValue);
      lastValue.current = newValue;
    }
  };

  return (
    <div
      className={Styles.wrapper}
      style={{ position: "relative" }}
      onClick={() => setEditing(true)}
    >
      {editing && (
        <div
          contentEditable={editable}
          ref={editableRef}
          suppressContentEditableWarning
          onBlur={handleBlur}
          className={Styles.field}
          onInput={adjustEditingFontSize}
          style={{
            textAlign: field.type === "number" ? "center" : "left",
            fontSize: `${fontSize}px`,
            lineHeight: LINE_HEIGHT,
            pointerEvents: "auto",
          }}
        >
          {field.value}
        </div>
      )}

      {!editing && (
        <div
          ref={tooltipRef}
          className={Styles.card}
          style={{
            textAlign: field.type === "number" ? "center" : "left",
            fontSize: `${fontSize}px`,
            lineHeight: LINE_HEIGHT,
            pointerEvents: "auto",
          }}
        >
          <AddTooltip
            data={spellsXPHB}
            text={field.value ?? ""}
            setTooltip={setTooltip}
            setTooltipSpell={setTooltipSpell}
          />
        </div>
      )}
    </div>
  );
}
