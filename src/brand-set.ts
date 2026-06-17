import type { ComponentType } from "react";
import type { IconSet } from "@particle-academy/react-fancy";
import { curatedMarks, curatedManifest } from "./marks";
import type { BrandIconProps, BrandIconManifestEntry } from "./marks";
import { logoMarks } from "./logos";

export type { BrandIconProps, BrandIconManifestEntry } from "./marks";

/**
 * The full brand catalog: curated CC0 marks plus any app/corp logos supplied
 * via `src/logos`. Keyed by the kebab name `<Icon name="…" />` resolves under.
 * Logos win over curated marks on key collision.
 */
const brandMarks: Record<string, ComponentType<BrandIconProps>> = {
  ...curatedMarks,
  ...logoMarks,
};

/**
 * Build an `IconSet` over a map of marks. Exported so `registerBrandIcons` can
 * fold in extra runtime logos without re-deriving the lookup.
 */
export function makeBrandIconSet(
  marks: Record<string, ComponentType<BrandIconProps>>,
): IconSet {
  return {
    resolve: (name: string) => marks[name] ?? null,
  };
}

/**
 * The default brand `IconSet` — pass to `registerIconAddendum` (or just call
 * `registerBrandIcons()`). `resolve("github")` returns the GitHub mark.
 */
export const brandIconSet: IconSet = makeBrandIconSet(brandMarks);

/**
 * Manifest of every curated mark in `brandIconSet` — `{ name, title, slug }`
 * per entry. Drives icon pickers (e.g. the fancy-cms picker). Runtime-supplied
 * logos are not enumerated here (the pack can't know their titles).
 */
export const brandIconManifest: BrandIconManifestEntry[] = curatedManifest;
