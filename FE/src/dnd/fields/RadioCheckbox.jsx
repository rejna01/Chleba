import Styles from "./RadioCheckbox.module.css";
import { useState, useRef } from "react";

export default function RadioCheckbox({ field, charId, id }) {
  const [checkValue, setCheckValue] = useState(field.value?field.value:"0.0")

  const clickTimeout = useRef(null);

const toggleSingle = () => {
  if (clickTimeout.current) return;

  clickTimeout.current = setTimeout(() => {
    clickTimeout.current = null;

    const nextValue = checkValue === "1.0" ? "0.0" : "1.0";
    setCheckValue(nextValue);

    fetch(`/api/fields`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: charId,
        nameOfField: id,
        value: nextValue,
      }),
    }).catch(console.error);
  }, 250);
};

  const toggleDouble = () => {
    clearTimeout(clickTimeout.current);
    clickTimeout.current = null;

    const nextValue = checkValue === "2.0" ? "0.0" : "2.0";
    setCheckValue(nextValue);

    fetch(`/api/fields`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: charId,
        nameOfField: id,
        value: nextValue,
      }),
    }).catch(console.error);
  };

  return (
    <div
      className={Styles.radioCheckbox}
      role="checkbox"
      tabIndex={0}
      onClick={toggleSingle}
      onDoubleClick={toggleDouble}
    >
      <span className={Styles.customRadio} data-value={checkValue} />
    </div>
  );
}
