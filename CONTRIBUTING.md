# Contributing to @particle-academy/fancy-brand-icons

Notes for anyone, human or agent, working ON this package's code. How to USE the
package is in [AGENTS.md](./AGENTS.md); what it is, is in [README.md](./README.md).
`CLAUDE.md` is a symlink to this file, so Claude Code reads these notes when it
works in this repo.

## Build and test

```bash
npm run build   # tsup
npm run dev     # tsup --watch
npm run lint    # tsc --noEmit && eslint .
npm test        # vitest run
```

Sources are in `src/` (`brand-set.ts`, `register.ts`, `index.ts`, `marks/`,
`logos/`); tests are in `tests/`.

## Regenerating the marks

The marks under `src/marks/` are generated from `simple-icons` by `scripts/generate.ts`:

```bash
npm run gen
```

It reads the curated slug list, pulls each `{ title, slug, path }`, and writes a self-contained component with the path inlined — so the published package never imports `simple-icons`.

## Keep these true

- **Every brand name ends in `-logo`**, so none can shadow a Lucide icon.
  `tests/lucide-collisions.test.tsx` fails the build if a name lacks the suffix
  or matches any Lucide name. Do not add bare-name aliases.
- **Zero runtime dependencies.** `simple-icons` is dev-only; path data is
  inlined as string literals.

## Changelog

Update `CHANGELOG.md` (Keep a Changelog, `[Unreleased]` at the top) in the same
commit as the change.
