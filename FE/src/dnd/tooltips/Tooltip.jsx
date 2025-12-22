import SpellTooltip from "./SpellTooltip";
import ItemTooltip from "./ItemTooltip";
import FeatTooltip from "./FeatTooltip";
import Styles from "./Tooltip.module.css";

export default function Tooltip({ entity }) {
  if (!entity) return null;

  switch (entity.type) {
    case "spell":
      return <SpellTooltip spell={entity.entity} />;

    case "item":
      return <ItemTooltip item={entity.entity} />;

    case "feat":
      return <FeatTooltip feat={entity.entity} />;

    default:
      return null;
  }
}
