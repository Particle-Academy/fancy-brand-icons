# @particle-academy/fancy-brand-icons

A **brand-icon addendum pack** for [`@particle-academy/react-fancy`](https://github.com/Particle-Academy/react-fancy). It layers ~24 curated brand marks (GitHub, X, Slack, Stripe, React, …) onto the Fancy `<Icon>` system so a bare `<Icon name="github" />` resolves the brand mark **on top of Lucide** — no `set=` query, no manual registration per icon.

- **Zero runtime dependencies.** The SVG path data is vendored from [Simple Icons](https://simpleicons.org) (CC0) and **inlined as string literals** at build time. `simple-icons` is a *dev*-only dependency — nothing from it ships in the bundle.
- **Monochrome** (`fill="currentColor"`) so marks inherit your icon color and sizing.
- **Tree-shakeable.** Import the whole pack, or just one mark.
- **Addendum API.** Registers via react-fancy ≥ 4.7's `registerIconAddendum`, so the base set still wins and brand marks supplement.

## Install

```bash
npm install @particle-academy/fancy-brand-icons
```

Peers: `@particle-academy/react-fancy` (>= 4.7), `react`, `react-dom`.

## Use

Register once at app startup, then use `<Icon>` anywhere:

```tsx
import { registerBrandIcons } from "@particle-academy/fancy-brand-icons";
import { Icon } from "@particle-academy/react-fancy";

registerBrandIcons();

// …anywhere in the tree:
<Icon name="github" />
<Icon name="stripe" size={32} />
<Icon name="tailwind" className="text-sky-500" />
```

`registerBrandIcons()` is idempotent — call it as many times as you like.

### Import a single mark (no registration, fully tree-shakeable)

```tsx
import { GithubIcon } from "@particle-academy/fancy-brand-icons";

<GithubIcon size={20} className="text-zinc-700" />
```

## Catalog

| name | name | name | name |
|---|---|---|---|
| `github` | `x` | `slack` | `youtube` |
| `stripe` | `discord` | `linkedin` | `google` |
| `apple` | `npm` | `node` | `react` |
| `typescript` | `javascript` | `tailwind` | `laravel` |
| `php` | `vercel` | `cloudflare` | `openai` |
| `anthropic` | `figma` | `notion` | `gmail` |

`node` → Node.js, `tailwind` → Tailwind CSS, `x` → X (Twitter).

### Manifest (for icon pickers)

`brandIconManifest` enumerates the catalog as `{ name, title, slug }` — feed it to a picker (e.g. the fancy-cms icon picker):

```ts
import { brandIconManifest } from "@particle-academy/fancy-brand-icons";
// [{ name: "github", title: "GitHub", slug: "github" }, …]  (24 entries)
```

## Supply your own logos

The pack only ships brand marks it has CC0 rights to. **Your product or client logos are yours to supply.** Merge them at registration time:

```tsx
const AcmeIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="…your path…" />
  </svg>
);

registerBrandIcons({ logos: { acme: AcmeIcon } });
// <Icon name="acme" />
```

See [`src/logos/README.md`](./src/logos/README.md) for the vendor-and-export path too.

## Public API

- `registerBrandIcons(options?)` — register the pack as a react-fancy addendum. `options.logos` merges extra marks.
- `brandIconSet` — the `IconSet` (`{ resolve(name) }`) of curated marks (+ logos).
- `makeBrandIconSet(marks)` — build an `IconSet` over an arbitrary mark map.
- `brandIconManifest` — `{ name, title, slug }[]` catalog.
- `curatedMarks` / `logoMarks` — the underlying key→component maps.
- Individual mark components: `GithubIcon`, `XIcon`, `SlackIcon`, … (one per catalog entry).
- Types: `BrandIconProps`, `BrandIconManifestEntry`, `RegisterBrandIconsOptions`.

## Regenerating the marks

The marks under `src/marks/` are generated from `simple-icons` by `scripts/generate.ts`:

```bash
npm run gen
```

It reads the curated slug list, pulls each `{ title, slug, path }`, and writes a self-contained component with the path inlined — so the published package never imports `simple-icons`.

## Trademark note

All brand names, logos, and marks are the property of their respective owners. This package ships only the **CC0 SVG paths** distributed by [Simple Icons](https://github.com/simple-icons/simple-icons) and provides them for identification/integration convenience; it implies no affiliation or endorsement. Use of any mark must comply with that brand's own trademark guidelines. **App / corporate logos you add via the logo seam are your own** — this pack ships none of them.

## License

MIT (this package). Brand marks are CC0 via Simple Icons; trademarks remain with their owners.
