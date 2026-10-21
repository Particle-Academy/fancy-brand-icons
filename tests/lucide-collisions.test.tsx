// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Icon } from "@particle-academy/react-fancy";
import * as lucide from "lucide-react";
import { brandIconSet, brandIconManifest } from "../src/brand-set";
import { curatedMarks, GithubIcon, XIcon } from "../src/marks";
import { registerBrandIcons } from "../src/register";

// The pack is registered as a react-fancy ADDENDUM, and addenda are consulted
// BEFORE the lazy lucide fallback. So any brand key that is also a lucide icon
// name replaces the lucide icon in every app that calls registerBrandIcons() —
// for every component in the kit, not just the ones that meant the brand.
//
// That is how `x` (the X / Twitter logo) turned every close button in the kit
// into the X logo (fixed in 0.3.0 by renaming it), and how `apple` silently
// swapped lucide's fruit for the Apple logo. Since 0.4.0 the rule is
// structural rather than reviewed: every brand name ends in `-logo`, and NO
// brand name may collide with a lucide name. There is no accepted-overlap list.

const kebabToPascal = (s: string) =>
    s.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");

const shadowsLucide = (name: string) =>
    Boolean((lucide as unknown as Record<string, unknown>)[kebabToPascal(name)]);

// A mark's path, as shipped — the fingerprint of "this logo rendered here".
const pathOf = (Mark: typeof XIcon) =>
    /d="([^"]+)"/.exec(renderToStaticMarkup(createElement(Mark, { size: 24 })))![1]!;
const X_LOGO_PATH = pathOf(XIcon);
const GITHUB_LOGO_PATH = pathOf(GithubIcon);

/** Every name the pack resolved a mark under before 0.4.0. */
const PRE_040_NAMES = [
    "github", "x-twitter", "slack", "youtube", "stripe", "discord", "linkedin",
    "google", "apple", "npm", "node", "react", "typescript", "javascript",
    "tailwind", "laravel", "php", "vercel", "cloudflare", "openai", "anthropic",
    "figma", "notion", "gmail",
];

describe("brand names vs lucide names", () => {
    it("lucide is actually loaded, so the collision check below can fire", () => {
        // Positive control: a check that cannot find `X` would pass every time.
        expect(shadowsLucide("x")).toBe(true);
        expect(shadowsLucide("github")).toBe(true);
        expect(shadowsLucide("arrow-right")).toBe(true);
        expect(shadowsLucide("definitely-not-an-icon")).toBe(false);
    });

    it("every brand name ends in -logo", () => {
        const unsuffixed = Object.keys(curatedMarks).filter((n) => !n.endsWith("-logo"));

        expect(unsuffixed).toEqual([]);
    });

    it("no brand name collides with any lucide name", () => {
        const shadowing = Object.keys(curatedMarks).filter(shadowsLucide);

        expect(shadowing).toEqual([]);
    });

    it("the manifest lists the same suffixed names as the resolver", () => {
        for (const entry of brandIconManifest) {
            expect(entry.name, `${entry.name} is unsuffixed`).toMatch(/-logo$/);
        }
    });

    it("no pre-0.4.0 bare name resolves through the brand set any more", () => {
        // NOT kept as aliases: an alias for `github` or `apple` would recreate
        // exactly the lucide collision the suffix removes.
        const stillResolving = PRE_040_NAMES.filter((n) => brandIconSet.resolve(n) !== null);

        expect(stillResolving).toEqual([]);
    });

    it("every pre-0.4.0 brand is still in the pack, under its -logo name", () => {
        const renamed = (n: string) => (n === "x-twitter" ? "x-logo" : `${n}-logo`);
        const missing = PRE_040_NAMES.filter((n) => brandIconSet.resolve(renamed(n)) === null);

        expect(missing).toEqual([]);
    });

    it("registers the X logo as `x-logo` and nowhere else", () => {
        expect(brandIconSet.resolve("x-logo")).toBe(XIcon);
        expect(brandIconSet.resolve("x")).toBeNull();
        expect(brandIconSet.resolve("x-twitter")).toBeNull();
        expect(brandIconManifest.find((e) => e.name === "x-logo")).toMatchObject({
            title: "X",
            slug: "x",
        });
    });
});

describe("after registerBrandIcons(), through react-fancy's real <Icon>", () => {
    it("bare names are lucide's glyphs; -logo names are the brand marks", async () => {
        registerBrandIcons();

        // The brand marks resolve synchronously (addenda are sync).
        expect(renderToStaticMarkup(createElement(Icon, { name: "x-logo" }))).toContain(X_LOGO_PATH);
        expect(renderToStaticMarkup(createElement(Icon, { name: "github-logo" }))).toContain(
            GITHUB_LOGO_PATH,
        );

        // The bare names must fall through to lucide. The lucide barrel is
        // lazy-loaded on first miss, so render until it lands rather than
        // asserting on the empty first render — an empty render would pass the
        // negative checks below without proving the name reaches lucide at all.
        let close = "";
        let github = "";
        let apple = "";
        await vi.waitFor(() => {
            close = renderToStaticMarkup(createElement(Icon, { name: "x" }));
            github = renderToStaticMarkup(createElement(Icon, { name: "github" }));
            apple = renderToStaticMarkup(createElement(Icon, { name: "apple" }));
            expect(close).toContain("lucide-x");
            expect(github).toContain("lucide-github");
            expect(apple).toContain("lucide-apple");
        });
        expect(close).not.toContain(X_LOGO_PATH);
        expect(github).not.toContain(GITHUB_LOGO_PATH);
    });
});
