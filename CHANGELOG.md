# Changelog

Notable changes to `@particle-academy/fancy-brand-icons`.

**BREAKING** marks anything that can stop working on upgrade. This package is
pre-1.0, so breaking changes land in MINOR releases — read those entries before
upgrading.

> Entries below **1.0** were reconstructed from git history when this file was
> introduced, so they summarise commit subjects rather than consumer impact.
> Everything from the next release onward is written by hand, in the same commit
> as the change.

---

## [Unreleased]

## 0.4.0 — 2026-10-21

### Changed

- **BREAKING — every brand mark is now registered as `<brand>-logo`.** The pack
  registers as an addendum that react-fancy consults *before* the Lucide
  fallback, so any bare brand name that is also a Lucide name replaced the
  Lucide icon app-wide. 0.3.0 fixed one instance (`x`); `apple` was still
  turning Lucide's fruit into the Apple logo, and `github`, `slack`, `youtube`,
  `linkedin` and `figma` were overriding Lucide's own glyphs. With the suffix no
  brand name can collide with any Lucide name, and a test now fails the build if
  one does.

  **What you must do:** wherever you used a brand name through `<Icon name="…">`
  or `icon="…"` **to mean the brand logo**, add the suffix — replace
  `name="github"` with `name="github-logo"`, `name="x-twitter"` with
  `name="x-logo"`, and so on, per the table below. The bare names no longer
  resolve through this pack and are **not** kept as aliases (an alias would
  bring the collision back).

  - Where the bare name has a Lucide icon (`github`, `slack`, `youtube`,
    `linkedin`, `figma`, `apple`), an un-updated use now renders **Lucide's
    glyph** instead of the brand mark — it does not break, it just looks
    different. If you meant Lucide's glyph (e.g. `apple` for the fruit), **do
    nothing**: this release fixes it.
  - Every other old name (`x-twitter`, `stripe`, `discord`, `google`, `npm`,
    `node`, `react`, `typescript`, `javascript`, `tailwind`, `laravel`, `php`,
    `vercel`, `cloudflare`, `openai`, `anthropic`, `notion`, `gmail`) has no
    Lucide equivalent, so an un-updated use renders **nothing**. Search for these
    first.
  - **Component exports are unchanged** — `GithubIcon`, `XIcon`, `AppleIcon`, …
    still import exactly as before, so tree-shaken imports need no change.
  - `brandIconManifest` and `curatedMarks` now list the suffixed names. An icon
    picker that stored a bare name should map it to `<name>-logo` (and
    `x-twitter` to `x-logo`).
  - Logos you pass via `registerBrandIcons({ logos })` are not renamed or
    checked; the README now recommends giving them the `-logo` suffix too.

  | old name | new name |
  |---|---|
  | `github` | `github-logo` |
  | `x-twitter` | `x-logo` |
  | `slack` | `slack-logo` |
  | `youtube` | `youtube-logo` |
  | `stripe` | `stripe-logo` |
  | `discord` | `discord-logo` |
  | `linkedin` | `linkedin-logo` |
  | `google` | `google-logo` |
  | `apple` | `apple-logo` |
  | `npm` | `npm-logo` |
  | `node` | `node-logo` |
  | `react` | `react-logo` |
  | `typescript` | `typescript-logo` |
  | `javascript` | `javascript-logo` |
  | `tailwind` | `tailwind-logo` |
  | `laravel` | `laravel-logo` |
  | `php` | `php-logo` |
  | `vercel` | `vercel-logo` |
  | `cloudflare` | `cloudflare-logo` |
  | `openai` | `openai-logo` |
  | `anthropic` | `anthropic-logo` |
  | `figma` | `figma-logo` |
  | `notion` | `notion-logo` |
  | `gmail` | `gmail-logo` |

  The collision test replaces 0.3.0's reviewed overlap list with a stronger
  invariant: every brand name ends in `-logo`, and none matches any Lucide name.

## 0.3.0 — 2026-10-20

### Changed

- **BREAKING — the X (Twitter) logo is now `x-twitter`, not `x`.** `x` is
  Lucide's close icon, and this pack registers as an addendum that react-fancy
  consults *before* the Lucide fallback. So in any app that called
  `registerBrandIcons()`, **every close button in the kit drew the X logo** —
  fancy-app-update's update stack, fancy-artboard's focus overlay, fancy-diff,
  fancy-slides' inspector, and your own `<Icon name="x" />`. After upgrading,
  `x` is the close cross again.

  **What you must do:** if you used `<Icon name="x" />` (or `icon="x"`) to mean
  **the X logo**, change it to `name="x-twitter"`. If you used it to mean
  *close* — which is what everything in the kit means by it — do nothing; it is
  fixed. The tree-shakeable `XIcon` component export is **unchanged**, so
  `import { XIcon } from "@particle-academy/fancy-brand-icons"` keeps working.
  `brandIconManifest` and `curatedMarks` now list the mark as `x-twitter`; an
  icon picker that stored `"x"` should map it to `"x-twitter"`.

### Added

- A test that fails the build if a brand name shadows a Lucide icon name without
  being on an explicit, reviewed list. Six names do, deliberately — `github`,
  `slack`, `youtube`, `linkedin`, `figma` (Lucide's own stand-ins for the same
  brands) and `apple` (in Lucide, the fruit). Nothing for you to do; the README
  now says which names shadow Lucide.

### Fixed

- **`CHANGELOG.md` is now in the published tarball.** `files` did not whitelist it, so npm never shipped it — and this package puts breaking changes in MINOR releases and tells you in the README to read the entry before taking one. The instruction existed for the author, who has the file, and not for the consumer, who is the only one being instructed. Nothing for you to do; the file simply arrives from this release on.

### Security

- `source-map-js` is pinned forward to `^1.2.2` via `overrides`. Versions up to
  1.2.1 allow an event-loop denial of service through indexed source-map section
  offsets, and it arrives here transitively through the build toolchain.
  **Nothing for a consumer to do, and no runtime change**: an npm package does
  not ship a lockfile, so this governs builds OF this repo, not anything
  installed FROM it. Recorded rather than left silent because the override it
  sits beside — `shell-quote` `^1.9.0`, added for an earlier advisory — was
  carried with no note of why, and had drifted back inside the vulnerable range
  before anyone looked.

## 0.2.0 — 2026-08-07

### Changed

- **BREAKING — Node older than 22 is no longer supported.** `engines.node` is now `>=22`; earlier releases declared no Node version at all.

  **What you must do:** on Node 22 or newer, nothing. Note npm only *warns* on an `engines` mismatch while **pnpm fails the install**, so this surfaces differently depending on your package manager. Node 18 is end-of-life and 20 is maintenance-only.

- **BREAKING — React 18 is no longer supported.** `peerDependencies.react` / `react-dom` are now `^19.0.0`.

  **What you must do:** on React 19, nothing. On React 18, stay on the previous release, or upgrade your app to 19 first.

  React 18 support was a claim nothing tested — every build and test in this package ran against 19, so the 18 half of the old range was never executed. An untested compatibility claim is worse than an absent one, because it reads as support.

### Why

These are the kit 0.5 platform floors, applied across every package at once so a consumer never has to resolve a mix. **No API changed, nothing was removed, nothing was renamed** — only what the package requires.


## 0.1.1 — 2026-06-19

- Maintenance only (3 internal commits).

## 0.1.0 — 2026-06-17

### Added

- fancy-brand-icons — brand-icon addendum pack (v0.1.0, #81)
