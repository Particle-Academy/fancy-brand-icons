import type { ComponentType } from "react";
import type { BrandIconProps } from "../marks";

/**
 * App / corp logo map — empty by default.
 *
 * The pack ships CC0 brand marks (see `../marks`); your own product or client
 * logos are yours to supply. Drop a component here (see this dir's README) and
 * add it to the map, OR pass `{ logos: { … } }` to `registerBrandIcons()` at
 * runtime. Both paths merge on top of the curated marks in `brandIconSet`.
 *
 * Example (uncomment + provide a real SVG):
 *
 *   export const AcmeIcon: ComponentType<BrandIconProps> = ({ className, size = 24 }) => (
 *     <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
 *       <path d="…" />
 *     </svg>
 *   );
 */
export const logoMarks: Record<string, ComponentType<BrandIconProps>> = {};
