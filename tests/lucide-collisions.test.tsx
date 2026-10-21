// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Icon } from "@particle-academy/react-fancy";
import * as lucide from "lucide-react";
import { brandIconSet, brandIconManifest } from "../src/brand-set";
import { curatedMarks, XIcon } from "../src/marks";
import { registerBrandIcons } from "../src/register";

// The pack is registered as a react-fancy ADDENDUM, and addenda are consulted
// BEFORE the lazy lucide fallback. So any brand key that is also a lucide icon
// name replaces the lucide icon in every app that calls registerBrandIcons() —
// for every component in the kit, not just the ones that meant the brand.
//
// That is how `x` (the X / Twitter logo) turned every close button in the kit
// into the X logo: fancy-app-update, fancy-artboard, fancy-diff, fancy-slides
// all use `icon="x"` to mean close.

const kebabToPascal = (s: string) =>
    s.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");

const shadowsLucide = (name: string) =>
    Boolean((lucide as unknown as Record<string, unknown>)[kebabToPascal(name)]);

// The X logo's path, as shipped in the mark — the fingerprint of "the logo
// rendered here" in markup.
const xLogoMarkup = renderToStaticMarkup(createElement(XIcon, { size: 24 }));
const X_LOGO_PATH = /d="([^"]+)"/.exec(xLogoMarkup)![1]!;

/**
 * Brand keys that DO shadow a lucide icon, deliberately. Each of these is a
 * lucide icon OF THE SAME BRAND (lucide's github is GitHub's mark), so the
 * brand pack is replacing a stand-in with the real thing — except `apple`,
 * which in lucide is the fruit. That one is listed for the owner to rule on,
 * not because it is known to be safe; nothing in the kit uses the fruit today.
 *
 * Adding a key here is a decision, not a fix: it means every `<Icon name>` of
 * that name across every consumer will render the brand mark.
 */
const ACCEPTED_LUCIDE_OVERLAPS = ["apple", "figma", "github", "linkedin", "slack", "youtube"];

describe("brand names vs lucide names", () => {
    it("lucide is actually loaded, so the collision check below can fire", () => {
        // Positive control: a check that cannot find `X` would pass every time.
        expect(shadowsLucide("x")).toBe(true);
        expect(shadowsLucide("arrow-right")).toBe(true);
        expect(shadowsLucide("definitely-not-an-icon")).toBe(false);
    });

    it("no brand key shadows a lucide icon unless it is an accepted overlap", () => {
        const shadowing = Object.keys(curatedMarks).filter(shadowsLucide).sort();

        expect(shadowing).toEqual(ACCEPTED_LUCIDE_OVERLAPS);
    });

    it("does not register the X logo under the bare name `x`", () => {
        expect(brandIconSet.resolve("x")).toBeNull();
        expect(brandIconManifest.find((e) => e.name === "x")).toBeUndefined();
    });

    it("registers the X logo under `x-twitter`", () => {
        expect(brandIconSet.resolve("x-twitter")).toBe(XIcon);
        expect(brandIconManifest.find((e) => e.name === "x-twitter")).toMatchObject({
            title: "X",
            slug: "x",
        });
    });
});

describe("after registerBrandIcons(), through react-fancy's real <Icon>", () => {
    it("`x` is lucide's close icon and `x-twitter` is the X logo", async () => {
        registerBrandIcons();

        // The brand mark resolves synchronously (addenda are sync).
        const brand = renderToStaticMarkup(createElement(Icon, { name: "x-twitter" }));
        expect(brand).toContain(X_LOGO_PATH);

        // `x` must fall through to lucide. The lucide barrel is lazy-loaded on
        // first miss, so render until it lands rather than asserting on the
        // empty first render — an empty render would pass the negative check
        // below without proving `x` reaches lucide at all.
        let close = "";
        await vi.waitFor(() => {
            close = renderToStaticMarkup(createElement(Icon, { name: "x" }));
            expect(close).toContain("lucide-x");
        });
        expect(close).not.toContain(X_LOGO_PATH);
    });
});
