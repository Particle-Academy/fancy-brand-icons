# Your app / corp logos

This directory is the **seam** for logos the pack does *not* ship: your own
product mark, your client's corporate logo, partner brands you have the rights
to render. The brand pack only vendors CC0 marks from Simple Icons (see the
top-level README's trademark note) — your own logos are yours to supply.

## Two ways to add a logo

### 1. Register at runtime (no rebuild of this package)

Pass extra marks straight into `registerBrandIcons` — they merge on top of the
curated set, so `<Icon name="acme" />` resolves your component:

```tsx
import { registerBrandIcons } from "@particle-academy/fancy-brand-icons";

const AcmeIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="…your path…" />
  </svg>
);

registerBrandIcons({ logos: { acme: AcmeIcon } });
```

### 2. Drop SVGs here and export them

If you fork/vendor this package, add `acme.tsx` next to this file (same shape as
the generated marks in `../marks/`), then map it in `index.ts` below. The map is
merged into the brand set automatically.
