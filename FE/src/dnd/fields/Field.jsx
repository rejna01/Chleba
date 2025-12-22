import { useState } from "react";

import RadioCheckbox from "./RadioCheckbox.jsx";
import TextField from "./TextField.jsx";
import ImageField from "./ImageField.jsx";

export default function Field({
  field,
  charId,
  saveField,
  editable,
  spellsXPHB,
  setTooltip,
  setTooltipEntity,
}) {
  return (
    <>
      <foreignObject x={field.x} y={field.y} width={field.w} height={field.h}>
        {field.type === "checkbox" && (
          <RadioCheckbox
            field={field}
            charId={charId}
            id={field.id}
            saveField={saveField}
            editable={editable}
          />
        )}

        {field.type === "img" && (
          <ImageField
            field={field}
            charId={charId}
            saveField={saveField}
            editable={editable}
          />
        )}

        {field.type !== "checkbox" && field.type !== "img" && (
          <TextField
            field={field}
            charId={charId}
            id={field.id}
            saveField={saveField}
            editable={editable}
            spellsXPHB={spellsXPHB}
            setTooltip={setTooltip}
            setTooltipEntity={setTooltipEntity}
          />
        )}
      </foreignObject>
    </>
  );
}
