import Styles from "./RadioCheckbox.module.css";

export default function RadioCheckbox({ checked, setChecked, charId, id }) {
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
