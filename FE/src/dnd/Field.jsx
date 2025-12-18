import Styles from "./DND_Denik.module.css";
import { useState } from "react";

import RadioCheckbox from "./fields/RadioCheckbox.jsx";
import TextField from "./fields/TextField.jsx";
import ImageField from "./fields/ImageField.jsx";

export default function Field({ field, charId }) {
  const [checked, setChecked] = useState(
    field.type === "checkbox" ? !!parseInt(field.value) : false
  );

  return (
    <foreignObject x={field.x} y={field.y} width={field.w} height={field.h}>
      {field.type === "checkbox" && (
        <RadioCheckbox
          checked={checked}
          setChecked={setChecked}
          charId={charId}
          id={field.id}
        />
      )}

      {field.type === "img" && <ImageField field={field} charId={charId} />}

      {field.type !== "checkbox" && field.type !== "img" && (
        <TextField field={field} charId={charId} />
      )}
    </foreignObject>
  );
}
