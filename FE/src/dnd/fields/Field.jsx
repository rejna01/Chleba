import { useState } from "react";

import RadioCheckbox from "./RadioCheckbox.jsx";
import TextField from "./TextField.jsx";
import ImageField from "./ImageField.jsx";

export default function Field({ field, charId }) {
  return (
    <foreignObject x={field.x} y={field.y} width={field.w} height={field.h}>
      {field.type === "checkbox" && (
        <RadioCheckbox
        field={field} 
          charId={charId}
          id={field.id}
        />
      )}

      {field.type === "img" && <ImageField field={field} charId={charId} />}

      {field.type !== "checkbox" && field.type !== "img" && (
        <TextField field={field} charId={charId} id={field.id}/>
      )}
    </foreignObject>
  );
}
