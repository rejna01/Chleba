import Styles from "./Tooltip.module.css";

export default function ItemTooltip({ item }) {
  return (
    <div className={Styles.card}>
      <div className={Styles.header}>
        <h2 className={Styles.name}>{item.name}</h2>
        <span className={Styles.level}>{item.rarity} item</span>
      </div>

      <div className={Styles.details}>
        <p>
          <strong>Source:</strong> {item.source} (Page {item.page})
        </p>

        {item.reqAttune && (
          <p>
            <strong>Attunement:</strong> {item.reqAttune}
          </p>
        )}
      </div>

      <div className={Styles.entries}>
        {item.entries.map((e, i) => (
          <p key={i}>{e}</p>
        ))}
      </div>
    </div>
  );
}
