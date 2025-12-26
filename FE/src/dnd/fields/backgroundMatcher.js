function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function buildBackgroundsMatchers() {
  console.log("🧬 buildBAckgroundsMatchers CALLED");

  try {
    const res = await fetch(`/backgrounds.json`);
    const data = await res.json();

    return data.background.map((background) => ({
      type: "background", // 👈 klíčové
      entity: background, // skutečný background objekt
      name: background.name,
      regex: new RegExp(`\\b${escapeRegex(background.name)}\\b`, "gi"),
    }));
  } catch (err) {
    console.error("Failed to fetch backgrounds:", err);
    return [];
  }
}

export const BACKGROUND_MATCHERS = await buildBackgroundsMatchers();
