import { renderEntry } from "./entryRenderer";
import Styles from "./Tooltip.module.css";

function formatProficiencies(profs) {
  return profs?.join(", ") || "None";
}

export default function BackgroundTooltip({ background }) {
  return (
    <div className={`${Styles.card} ${Styles.background}`}>
      <div className={Styles.header}>
        <h2 className={Styles.name}>{background.name}</h2>
        <span className={Styles.level}>Background</span>
      </div>

      <div className={Styles.details}>
        {background.skillProficiencies && (
          <p>
            <strong>Skill Proficiencies:</strong>{" "}
            {formatProficiencies(background.skillProficiencies)}
          </p>
        )}
        {background.toolProficiencies && (
          <p>
            <strong>Tool Proficiencies:</strong>{" "}
            {formatProficiencies(background.toolProficiencies)}
          </p>
        )}
        {background.equipment && (
          <p>
            <strong>Starting Equipment:</strong>{" "}
            {background.equipment.join(", ")}
          </p>
        )}
      </div>

      <div className={Styles.entries}>
        {background.entries?.map((entry, idx) =>
          renderEntry(entry, `bg-${idx}`)
        )}
      </div>
    </div>
  );
}
