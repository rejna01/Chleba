import SpellTooltip from "./SpellTooltip";
import ItemTooltip from "./ItemTooltip";
import FeatTooltip from "./FeatTooltip";
import BackgroundTooltip from "./BackgroundTooltip";
import ClassTooltip from "./ClassTooltip";
import RaceTooltip from "./RaceTooltip";

export default function Tooltip({ entity }) {
  if (!entity) return null;
console.log("Rendering tooltip for entity:", entity);
  switch (entity.type) {
    case "spell":
      return <SpellTooltip spell={entity.entity} />;

    case "item":
      return <ItemTooltip item={entity.entity} />;

    case "feat":
      return <FeatTooltip feat={entity.entity} />;
      
    case "class":
      return <ClassTooltip class={entity.entity} />;
      
    case "background":
      return <BackgroundTooltip background={entity.entity} />;

    case "race":
      return <RaceTooltip race={entity.entity} />;  

    default:
      return null;
  }
}
