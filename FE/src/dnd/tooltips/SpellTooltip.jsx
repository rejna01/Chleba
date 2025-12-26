import { renderEntry } from "./entryRenderer";
import Styles from "./Tooltip.module.css";


export default function SpellTooltip({ spell }) {
  return (
    <div className={Styles.card}>
      <div className={Styles.header}>
        <h2 className={Styles.name}>{spell.name}</h2>
        <span className={Styles.level}>
          {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`} (
          {spell.school})
        </span>
      </div>

      <div className={Styles.details}>
        <p>
          <strong>Source:</strong> {spell.source} (Page {spell.page})
        </p>

        <p>
          <strong>Casting Time:</strong>{" "}
          {spell.time.map((t) => `${t.number} ${t.unit}`).join(", ")}
        </p>

        <p>
          <strong>Range:</strong>{" "}
          {spell.range.distance?.amount
            ? `${spell.range.distance.amount} ${spell.range.distance.type}`
            : spell.range.type}
        </p>

        <p>
          <strong>Components:</strong>{" "}
          {Object.entries(spell.components)
            .filter(([_, v]) => v)
            .map(([k]) => k.toUpperCase())
            .join(", ")}
        </p>

        <p>
          <strong>Duration:</strong>{" "}
          {spell.duration.map((d) => d.type).join(", ")}
        </p>
      </div>

      <div className={Styles.entries}>
  {spell.entries.map((e, i) => (
    <div key={i}>
      {renderEntry(e)}
    </div>
  ))}

        {spell.entriesHigherLevel?.map((h, i) => (
          <div key={i} className={Styles.higherLevel}>
            <strong>{h.name}</strong>
            {h.entries.map((e, j) => (
              <p key={j}>{e}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
