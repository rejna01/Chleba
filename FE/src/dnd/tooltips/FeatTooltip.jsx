import Styles from "./Tooltip.module.css";

function formatPrerequisite(prereq) {
  return prereq
    .map((p) => {
      if (p.campaign) return p.campaign.join(", ");
      if (p.exclusiveFeatCategory) return "Dragonmark";
      return "Special";
    })
    .join(" / ");
}

export default function FeatTooltip({ feat }) {
  return (
    <div className={`${Styles.card} ${Styles.feat}`}>
      <div className={Styles.header}>
        <h2 className={Styles.name}>{feat.name}</h2>
        <span className={Styles.level}>Feat</span>
      </div>

      <div className={Styles.details}>
        <p>
          <strong>Source:</strong> {feat.source} (Page {feat.page})
        </p>

        {feat.prerequisite && (
          <p>
            <strong>Prerequisite:</strong>{" "}
            {formatPrerequisite(feat.prerequisite)}
          </p>
        )}
      </div>

      <div className={Styles.entries}>
        {feat.entries.map((entry, idx) =>
          typeof entry === "string" ? (
            <p key={idx}>{entry}</p>
          ) : (
            <div key={idx} className={Styles.entryBlock}>
              <strong>{entry.name}</strong>
              {entry.entries.map((e, i) => (
                <p key={i}>{e}</p>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
