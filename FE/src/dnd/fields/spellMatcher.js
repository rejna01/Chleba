function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function buildSpellMatchers() {
  console.log("🔥 buildSpellMatchers CALLED");

  try {
    const res = await fetch(`/spells-xphb.json`);
    const data = await res.json();

    return data.spell.map((spell) => ({
      type: "spell",
      entity: spell,
      name: spell.name,
      regex: new RegExp(`\\b${escapeRegex(spell.name)}\\b`, "gi"),
    }));
  } catch (err) {
    console.error("Failed to fetch spells:", err);
    return [];
  }
}

// Použití
export const SPELL_MATCHERS = await buildSpellMatchers();
