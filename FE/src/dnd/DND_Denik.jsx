import Styles from "./DND_Denik.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import Field from "./fields/Field.jsx";
import Tools from "./Tools.jsx";
import Tooltip from "./tooltips/Tooltip.jsx";
import Notes from "./notes/Notes.jsx";
import { openAndReadPdf, saveFilledPdf } from "./js/PDFfileWorker.js";
import { fi } from "@faker-js/faker";

function getModifier(stat) {
  return Math.floor((stat - 10) / 2);
}
const derivedFields = [
  // Ability modifiers
  { fieldId: "strengthBonus", type: "modifier", base: "strength" },
  { fieldId: "dexterityBonus", type: "modifier", base: "dexterity" },
  { fieldId: "constitutionBonus", type: "modifier", base: "constitution" },
  { fieldId: "intelligenceBonus", type: "modifier", base: "intelligence" },
  { fieldId: "wisdomBonus", type: "modifier", base: "wisdom" },
  { fieldId: "charismaBonus", type: "modifier", base: "charisma" },

  // Saving throws
  {
    fieldId: "savingThrowStrength",
    type: "savingThrow",
    mod: "strengthBonus",
    prof: "strengthCheckbox",
  },
  {
    fieldId: "savingThrowDexterity",
    type: "savingThrow",
    mod: "dexterityBonus",
    prof: "dexterityCheckbox",
  },
  {
    fieldId: "savingThrowConstitution",
    type: "savingThrow",
    mod: "constitutionBonus",
    prof: "constitutionCheckbox",
  },
  {
    fieldId: "savingThrowIntelligence",
    type: "savingThrow",
    mod: "intelligenceBonus",
    prof: "intelligenceCheckbox",
  },
  {
    fieldId: "savingThrowWisdom",
    type: "savingThrow",
    mod: "wisdomBonus",
    prof: "wisdomCheckbox",
  },
  {
    fieldId: "savingThrowCharisma",
    type: "savingThrow",
    mod: "charismaBonus",
    prof: "charismaCheckbox",
  },

  {
    fieldId: "acrobatics",
    type: "savingThrow",
    mod: "dexterityBonus",
    prof: "acrobaticsCheckbox",
  },
  {
    fieldId: "animalHandling",
    type: "savingThrow",
    mod: "wisdomBonus",
    prof: "animalHandlingCheckbox",
  },
  {
    fieldId: "arcana",
    type: "savingThrow",
    mod: "intelligenceBonus",
    prof: "arcanaCheckbox",
  },
  {
    fieldId: "athletics",
    type: "savingThrow",
    mod: "strengthBonus",
    prof: "athleticsCheckbox",
  },
  {
    fieldId: "deception",
    type: "savingThrow",
    mod: "charismaBonus",
    prof: "deceptionCheckbox",
  },
  {
    fieldId: "history",
    type: "savingThrow",
    mod: "intelligenceBonus",
    prof: "historyCheckbox",
  },
  {
    fieldId: "insight",
    type: "savingThrow",
    mod: "wisdomBonus",
    prof: "insightCheckbox",
  },
  {
    fieldId: "intimidation",
    type: "savingThrow",
    mod: "charismaBonus",
    prof: "intimidationCheckbox",
  },
  {
    fieldId: "investigation",
    type: "savingThrow",
    mod: "intelligenceBonus",
    prof: "investigationCheckbox",
  },
  {
    fieldId: "medicine",
    type: "savingThrow",
    mod: "wisdomBonus",
    prof: "medicineCheckbox",
  },
  {
    fieldId: "nature",
    type: "savingThrow",
    mod: "intelligenceBonus",
    prof: "natureCheckbox",
  },
  {
    fieldId: "perception",
    type: "savingThrow",
    mod: "wisdomBonus",
    prof: "perceptionCheckbox",
  },
  {
    fieldId: "performance",
    type: "savingThrow",
    mod: "charismaBonus",
    prof: "performanceCheckbox",
  },
  {
    fieldId: "persuasion",
    type: "savingThrow",
    mod: "charismaBonus",
    prof: "persuasionCheckbox",
  },
  {
    fieldId: "religion",
    type: "savingThrow",
    mod: "intelligenceBonus",
    prof: "religionCheckbox",
  },
  {
    fieldId: "sleightOfHand",
    type: "savingThrow",
    mod: "dexterityBonus",
    prof: "sleightOfHandCheckbox",
  },
  {
    fieldId: "stealth",
    type: "savingThrow",
    mod: "dexterityBonus",
    prof: "stealthCheckbox",
  },
  {
    fieldId: "survival",
    type: "savingThrow",
    mod: "wisdomBonus",
    prof: "survivalCheckbox",
  },
  // Sem můžeš přidat další odvozená pole, např. initiative, passive perception atd.];
];
function generateId() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const datetime = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const letters = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");

  return `id_${datetime}_${letters}`;
}

export default function DND_Denik() {
  const [spellsXPHB, setSpellsXPHB] = useState();
  const { char } = useParams();

  const [sheet, setSheet] = useState(null);
  const [editable, setEditable] = useState(true);
  const [zoom, setZoom] = useState(1);

  const svgRef = useRef(null);
  const viewportRef = useRef(null);

  const [tooltip, setTooltip] = useState(false);
  const [tooltipEntity, setTooltipEntity] = useState(null);

  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([
    { title: "note1", id: 1 },
    { title: "note2", id: 2 },
  ]);

  function calculate(sheet) {
    if (!sheet) return sheet;

    const profBonus = parseInt(
      sheet.fields.find((f) => f.id === "proeficiencyBonus")?.value || "0",
      10
    );

    // 1️⃣ Spočítáme všechny modifikátory nejdříve
    const tempFields = sheet.fields.map((field) => {
      const def = derivedFields.find((d) => d.fieldId === field.id);
      if (!def) return field;

      if (def.type === "modifier") {
        const baseValue = parseInt(
          sheet.fields.find((f) => f.id === def.base)?.value || "10",
          10
        );
        saveField(field.id, getModifier(baseValue).toString());
        return { ...field, value: getModifier(baseValue).toString() };
      }
      return field; // ostatní ponecháme na další krok
    });

    // 2️⃣ Spočítáme dependent fields (saving throws, skills…)
    const newFields = tempFields.map((field) => {
      const def = derivedFields.find((d) => d.fieldId === field.id);
      if (!def || def.type === "modifier") return field;

      switch (def.type) {
        case "savingThrow": {
          // vezmeme aktuální mod z právě dopočtených tempFields
          const mod = parseInt(
            tempFields.find((f) => f.id === def.mod)?.value || "0",
            10
          );

          // profMultiplier z pole (0.0, 1.0, 2.0)
          const profMultiplier = parseFloat(
            tempFields.find((f) => f.id === def.prof)?.value || "0"
          );

          const value = mod + Math.round(profMultiplier * profBonus);
          saveField(field.id, value.toString());
          return { ...field, value: value.toString() };
        }

        // sem můžeš přidat další dependent typy
        default:
          return field;
      }
    });

    return { ...sheet, fields: newFields };
  }

  
  async function loadFromPDF(fieldObj) {
    try {
      const filledFieldObj = await openAndReadPdf(fieldObj);
      filledFieldObj.fields.forEach((field) => {
        saveField(field.id, field.value); 
      });
    } catch (err) {
      console.error(err);
    }
  };

  function onOpen(noteId, instanceId) {
    console.log("open note", noteId, " - ", instanceId);
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.instanceId === instanceId
          ? {
              instanceId: instanceId,
              title: "note" + noteId,
              content:
                "This is my " + (noteId == 1 ? "first" : "second") + " note.",
              position: { x: 100, y: 100 },
              size: { width: 200, height: 150 },
              pageNumber: 5,
            }
          : note
      )
    );
  }

  function onClose(noteId) {
    setNotes((prevNotes) =>
      prevNotes.filter((note) => note.instanceId !== noteId)
    );
  }
  function addNote() {
    setNotes((prevNotes) => [
      ...prevNotes,
      {
        instanceId: generateId(),
      },
    ]);
  }

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    fetch(`/api/fields/${char}`)
      .then((res) => res.json())
      .then(setSheet)
      .catch(console.error);
  }, [char]);

  useEffect(() => {
    fetch(`/spells-xphb.json`)
      .then((res) => res.json())
      .then(setSpellsXPHB)
      .catch(console.error);
  }, []);
  useEffect(() => {
    if (!sheet) return;

    document.title = "DnD deník: " + sheet.id;
  }, [sheet]);
  /* ---------------- FETCH ---------------- */

  function saveField(fieldId, newValue) {
    setSheet((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === fieldId ? { ...field, value: newValue } : field
      ),
    }));

    fetch(`/api/fields`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: char,
        nameOfField: fieldId,
        value: newValue,
      }),
    }).catch(console.error);
  }
  /* ---------------- ZOOM ---------------- */

  const handleWheel = useCallback((event) => {
    if (!event.ctrlKey) return;

    //event.preventDefault();

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
  /*useLayoutEffect(() => {
    if (!svgRef.current || !viewportRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    viewportRef.current.style.height = rect.height + "px";
  }, [zoom]);*/
  /* ---------------- RENDER ---------------- */

  if (!sheet || !spellsXPHB) {
    return <div className={Styles.loading}>Loading…</div>;
  }

  const { viewBox, fields } = sheet;

  return (
    <div className={Styles.viewport} onWheel={handleWheel} ref={viewportRef}>
      <svg
        ref={svgRef}
        className={Styles.svg}
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        width="90vw"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "50% 0%",
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
          <Field
            key={field.id}
            field={field}
            charId={char}
            saveField={saveField}
            editable={editable}
            spellsXPHB={spellsXPHB}
            setTooltip={setTooltip}
            setTooltipEntity={setTooltipEntity}
          />
        ))}
      </svg>
      <Tools
        tools={[
          {
            label: "Dopočítat",
            icon: "📟",
            onClick: () => setSheet((prev) => calculate(prev)),
          },
          {
            label: editable ? "Zakázat editaci" : "Povolit editaci",
            icon: "📝",
            onClick: () => setEditable(!editable),
          },
          {
            label: "5e.tools",
            icon: "🔗",
            onClick: () => window.open("https://5e.tools", "_blank"),
          },
          {
            label: "Import PDF",
            icon: "📥",
            onClick: () => loadFromPDF(sheet),
          },
          {
            label: "Export PDF",
            icon: "📤",
            onClick: () => saveFilledPdf(sheet),
          },
          {
            label: "Poznámky",
            icon: "🗒️",
            onClick: addNote,
          },
        ]}
      />
      {tooltip && <Tooltip entity={tooltipEntity}></Tooltip>}
      {notes.map((note) => (
        <Notes
          key={note.instanceId}
          onClose={() => onClose(note.instanceId)}
          note={note}
          onOpen={(id) => onOpen(id, note.instanceId)}
          allNotes={allNotes}
          editable={editable}
        />
      ))}
    </div>
  );
}
