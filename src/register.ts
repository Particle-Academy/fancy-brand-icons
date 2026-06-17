import type { ComponentType } from "react";
import { registerIconAddendum } from "@particle-academy/react-fancy";
import { brandIconSet, makeBrandIconSet } from "./brand-set";
import { curatedMarks } from "./marks";
import { logoMarks } from "./logos";
import type { BrandIconProps } from "./marks";

export interface RegisterBrandIconsOptions {
  /**
   * Extra app/corp logos to merge on top of the curated marks, keyed by the
   * name `<Icon name="…" />` should resolve them under. These win over the
   * built-in marks on key collision.
   */
  logos?: Record<string, ComponentType<BrandIconProps>>;
}

let registered = false;

/**
 * Register the brand-icon pack as a react-fancy addendum so bare
 * `<Icon name="github" />` resolves the brand mark on top of Lucide (or any
 * swapped base set), with no `set=` needed.
 *
 * Idempotent: calling it again is a no-op *unless* you pass new `logos`, in
 * which case a fresh set including those logos is registered (addenda stack,
 * and an earlier-registered set without the logo still defers to the base —
 * the new set fills the gap).
 *
 * ```ts
 * import { registerBrandIcons } from "@particle-academy/fancy-brand-icons";
 * registerBrandIcons();
 * // …then anywhere: <Icon name="github" />
 * ```
 */
export function registerBrandIcons(options?: RegisterBrandIconsOptions): void {
  const extra = options?.logos;

  if (extra && Object.keys(extra).length > 0) {
    const merged = makeBrandIconSet({ ...curatedMarks, ...logoMarks, ...extra });
    registerIconAddendum(merged);
    registered = true;
    return;
  }

  if (registered) return;
  registerIconAddendum(brandIconSet);
  registered = true;
}
