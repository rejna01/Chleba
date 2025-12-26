import { renderEntry } from "./entryRenderer";
import Styles from "./Tooltip.module.css";

function formatSize(sizeArr) {
  if (!sizeArr?.length) return null;
  return sizeArr.join(", ");
}

function formatSpeed(speed) {
  if (!speed) return null;

  return Object.entries(speed)
    .map(([type, value]) => `${type} ${value} ft.`)
    .join(", ");
}

function formatAbilities(ability) {
  if (!ability?.length) return null;

  // 5eTools race abilities jsou pole objektů
  return ability.map((ab, i) => (
    <span key={i}>
      {Object.entries(ab)
        .map(([stat, val]) => `${stat.toUpperCase()} +${val}`)
        .join(", ")}
    </span>
  ));
}

function formatLanguages(langProfs) {
  if (!langProfs?.length) return null;

  return langProfs
    .flatMap(obj => Object.keys(obj))
    .map(l => l.charAt(0).toUpperCase() + l.slice(1))
    .join(", ");
}

export default function RaceTooltip({ race }) {
  if (!race) return null;

  return (
    <div className={Styles.card}>
      {/* Header */}
      <div className={Styles.header}>
        <h2 className={Styles.name}>{race.name}</h2>
        <span className={Styles.level}>Race</span>
      </div>

      {/* Details */}
      <div className={Styles.details}>
        <p>
          <strong>Source:</strong> {race.source} (Page {race.page})
        </p>

        {race.size && (
          <p>
            <strong>Size:</strong> {formatSize(race.size)}
          </p>
        )}

        {race.speed && (
          <p>
            <strong>Speed:</strong> {formatSpeed(race.speed)}
          </p>
        )}

        {race.ability && (
          <p>
            <strong>Ability Score Increase:</strong>{" "}
            {formatAbilities(race.ability)}
          </p>
        )}

        {race.languageProficiencies && (
          <p>
            <strong>Languages:</strong>{" "}
            {formatLanguages(race.languageProficiencies)}
          </p>
        )}

        {race.traitTags?.length > 0 && (
          <p>
            <strong>Traits:</strong> {race.traitTags.join(", ")}
          </p>
        )}
      </div>

      {/* Traits / Features */}
      <div className={Styles.entries}>
        {race.entries?.map((entry, idx) =>
          renderEntry(entry, idx)
        )}
      </div>
    </div>
  );
}
