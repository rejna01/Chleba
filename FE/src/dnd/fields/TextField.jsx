import { useEffect, useRef, useState } from "react";
import Styles from "./TextField.module.css";
import { SPELL_MATCHERS } from "./spellMatcher";
import { ITEM_MATCHERS } from "./itemMatcher";
import { FEAT_MATCHERS } from "./featMatcher";
import { BACKGROUND_MATCHERS } from "./backgroundMatcher";
import { RACE_MATCHERS } from "./raceMatcher";

const LINE_HEIGHT = 1.2;
const MIN_FONT_SIZE = 6;

// parseTextWithSpells – rozdělí text na části a obalí spell názvy
function parseTextWithSpells(text, matchers, setTooltip, setTooltipEntity) {
const [tooltipLocked, setTooltipLocked] = useState(false);
  useEffect(() => {
  const handleClickOutside = () => {
    setTooltipLocked(false);
    setTooltip(false);
    setTooltipEntity(null);
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);
  let parts = [{ text, entity: null }];

  matchers.forEach(({ regex, ...entity }) => {
    const newParts = [];

    parts.forEach((part) => {
      if (part.entity) {
        newParts.push(part);
        return;
      }

      let lastIndex = 0;
      let match;
      while ((match = regex.exec(part.text)) !== null) {
        if (match.index > lastIndex) {
          newParts.push({
            text: part.text.slice(lastIndex, match.index),
            entity: null,
          });
        }
        newParts.push({ text: match[0], entity });
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < part.text.length) {
        newParts.push({ text: part.text.slice(lastIndex), entity: null });
      }
    });

    parts = newParts;
  });
  return parts.map((part, i) =>
    part.entity ? (
      <span
        key={i}
        className={Styles.hover}
        onContextMenu={(e) => {
          console.log("RMB clicked");
          e.preventDefault(); // zruší defaultní RMB menu
          //setTooltipLocked(!tooltipLocked);
          setTooltip(true);
          setTooltipEntity(part.entity);
        }}
        onMouseEnter={() => {
          setTooltip(true);
          setTooltipEntity(part.entity);
        }}
        onMouseLeave={() => {
          if (tooltipLocked) return;
          setTooltip(false)
        }}
      >
        {part.text}
      </span>
    ) : (
      <span style={{ whiteSpace: "pre-wrap" }} key={`plain-${i}`}>
        {part.text}
      </span>
    )
  );
}

// AddTooltip – využívá parseTextWithSpells a globální SPELL_MATCHERS
function AddTooltip({ text, matchers, setTooltip, setTooltipEntity }) {
  if (!text || !matchers || matchers.length === 0) return <span>{text}</span>;

  return (
    <>{parseTextWithSpells(text, matchers, setTooltip, setTooltipEntity)}</>
  );
}

// TextField komponenta
export default function TextField({
  field,
  saveField,
  editable,
  setTooltip,
  setTooltipEntity,
}) {
  const [editing, setEditing] = useState(false);
  const [fontSize, setFontSize] = useState(field.h < 50 ? field.h / 1.2 : 12);
  const oneLiner = field.h < 50;
  const editableRef = useRef(null);
  const tooltipRef = useRef(null);
  const lastValue = useRef(field.value ?? "");

  const allMatchers = [...SPELL_MATCHERS, ...ITEM_MATCHERS, ...FEAT_MATCHERS, ...BACKGROUND_MATCHERS, ...RACE_MATCHERS]; //- Dodělat itemy později

  const adjustFontSize = (el) => {
    if (!el || !oneLiner) return;

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
  const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    document.execCommand("insertLineBreak");
    e.preventDefault();
  }
};

  const adjustEditingFontSize = (e) => {
    const el = e.target;
    if (!el || el.innerText === lastValue.current || !oneLiner) return;
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
          onKeyDown={handleKeyDown}
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
            text={field.value ?? ""}
            matchers={allMatchers}
            setTooltip={setTooltip}
            setTooltipEntity={setTooltipEntity}
          />
        </div>
      )}
    </div>
  );
}
