function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function buildItemMatchers() {
  console.log("🔥 buildItemMatchers CALLED");

  try {
    const res = await fetch(`/items.json`);
    const data = await res.json();

    return data.item.map((item) => ({
      type: "item",
      entity: item,
      name: item.name,
      regex: new RegExp(`\\b${escapeRegex(item.name)}\\b`, "gi"),
    }));
  } catch (err) {
    console.error("Failed to fetch itemss:", err);
    return [];
  }
}

// Použití
export const ITEM_MATCHERS = await buildItemMatchers();
