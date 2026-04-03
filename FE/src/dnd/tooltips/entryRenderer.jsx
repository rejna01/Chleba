import Styles from "./Tooltip.module.css";

export function renderEntry(entry, key) {
  if (typeof entry === "string") {
    return <p key={key}>{entry}</p>;
  }

  if (!entry || typeof entry !== "object") {
    return null;
  }

  switch (entry.type) {
    case "entries":
      return (
        <div key={key} className={Styles.entryBlock}>
          {entry.name && <strong>{entry.name}</strong>}
          {entry.entries?.map((e, i) => renderEntry(e, `${key}-${i}`))}
        </div>
      );

    case "list":
      return (
        <ul key={key}>
          {entry.items?.map((item, i) => (
            <li key={i}>{renderEntry(item, `${key}-item-${i}`)}</li>
          ))}
        </ul>
      );
    case "item":
      return (
        <div key={key} className={Styles.listItem}>
          {entry.name && (
            <strong className={Styles.itemName}>{entry.name}</strong>
          )}
          {renderEntry(entry.entry, `${key}-entry`)}
        </div>
      );
    case "quote":
    case "inset":
      return (
        <blockquote key={key}>
          {entry.entries?.map((e, i) => renderEntry(e, `${key}-q-${i}`))}
        </blockquote>
      );

    case "table":
      return (
        <table key={key}>
          <thead>
            <tr>
              {entry.colLabels?.map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entry.rows?.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );

    default:
      return (
        <p key={key} className={Styles.unsupported}>
          Unsupported entry type: {entry.type}
        </p>
      );
  }
}
