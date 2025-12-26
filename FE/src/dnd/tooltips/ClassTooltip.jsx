import { renderEntry } from "./entryRenderer";
import Styles from "./Tooltip.module.css";

export default function ClassFeatureTooltip({ feature }) {
  return (
    <div className={`${Styles.card} ${Styles.classFeature}`}>
      <div className={Styles.header}>
        <h2 className={Styles.name}>{feature.name}</h2>
        <span className={Styles.level}>
          {feature.level ? `Level ${feature.level}` : "Class Feature"}
        </span>
      </div>

      {feature.prerequisite && (
        <div className={Styles.details}>
          <p>
            <strong>Prerequisite:</strong> {feature.prerequisite.join(", ")}
          </p>
        </div>
      )}

      <div className={Styles.entries}>
        {feature.entries?.map((entry, idx) =>
          renderEntry(entry, `cf-${idx}`)
        )}
      </div>
    </div>
  );
}
