function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function buildRaceMatchers() {
  console.log("🧬 buildRaceMatchers CALLED");

  try {
    const res = await fetch(`/races.json`);
    const data = await res.json();

    return data.race.map((race) => ({
      type: "race", // 👈 klíčové
      entity: race, // skutečný race objekt
      name: race.name,
      regex: new RegExp(`\\b${escapeRegex(race.name)}\\b`, "gi"),
    }));
  } catch (err) {
    console.error("Failed to fetch races:", err);
    return [];
  }
}

export const RACE_MATCHERS = await buildRaceMatchers();
