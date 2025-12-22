function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function buildFeatMatchers() {
  console.log("🧬 buildFeatMatchers CALLED");

  try {
    const res = await fetch(`/feats.json`);
    const data = await res.json();

    return data.feat.map((feat) => ({
      type: "feat", // 👈 klíčové
      entity: feat, // skutečný feat objekt
      name: feat.name,
      regex: new RegExp(`\\b${escapeRegex(feat.name)}\\b`, "gi"),
    }));
  } catch (err) {
    console.error("Failed to fetch feats:", err);
    return [];
  }
}

export const FEAT_MATCHERS = await buildFeatMatchers();
