import { renderEntry } from "./entryRenderer";
import Styles from "./Tooltip.module.css";

function extractProficiencies(list) {
  if (!Array.isArray(list)) return "None";

  return list
    .flatMap((obj) =>
      Object.entries(obj)
        .filter(([, v]) => v === true)
        .map(([k]) => k)
    )
    .join(", ");
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
            {extractProficiencies(background.skillProficiencies)}
          </p>
        )}

        {background.toolProficiencies && (
          <p>
            <strong>Tool Proficiencies:</strong>{" "}
            {extractProficiencies(background.toolProficiencies)}
          </p>
        )}

        {background.feats && (
          <p>
            <strong>Feat:</strong> {Object.keys(background.feats[0]).join(", ")}
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
