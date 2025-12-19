import { useEffect, useRef, useState } from "react";
import Styles from "./TextField.module.css";

const LINE_HEIGHT = 1.2;
const MIN_FONT_SIZE = 6;

export default function TextField({ field, charId, saveField, editable }) {
  const editableRef = useRef(null);
  const lastValue = useRef(field.value ?? "");

  const [fontSize, setFontSize] = useState(
    field.h < 50 ? field.h / LINE_HEIGHT : 12
  );

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
    saveField(field.id, e.target.innerText);
    const newValue = e.target.innerText;
    if (newValue === lastValue.current) return;

    lastValue.current = newValue;
  };

  return (
    <div
      ref={editableRef}
      contentEditable = {editable}
      suppressContentEditableWarning
      spellCheck={false}
      onInput={handleInput}
      onBlur={handleBlur}
      className={Styles.field}
      style={{
        textAlign: field.type === "number" ? "center" : "left",
        fontSize: `${fontSize}px`,
        lineHeight: LINE_HEIGHT,
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
