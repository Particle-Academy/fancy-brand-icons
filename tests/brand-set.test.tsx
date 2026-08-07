// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { brandIconManifest, brandIconSet, makeBrandIconSet } from "../src/brand-set";
import { curatedMarks } from "../src/marks";

describe("brand icon set", () => {
    it("resolves a curated mark by its kebab name", () => {
        expect(brandIconSet.resolve("github")).toBeTypeOf("function");
    });

    it("returns null for an unknown name rather than throwing", () => {
        // The set is registered as an ADDENDUM: react-fancy calls resolve() for
        // every icon lookup in the app, most of which are not brand marks.
        // Throwing here would take down any page using a lucide icon.
        expect(brandIconSet.resolve("definitely-not-a-brand")).toBeNull();
    });

    it("lets supplied logos win over a curated mark on key collision", () => {
        const mine = () => null;
        const set = makeBrandIconSet({ ...curatedMarks, github: mine });

        expect(set.resolve("github")).toBe(mine);
    });

    it("keeps the default set unpolluted when a custom set is built", () => {
        const mine = () => null;
        makeBrandIconSet({ ...curatedMarks, github: mine });

        expect(brandIconSet.resolve("github")).not.toBe(mine);
    });
});

describe("manifest", () => {
    it("describes every curated mark, and only marks that exist", () => {
        // The manifest drives icon pickers. An entry with no mark renders a
        // blank tile; a mark with no entry is invisible to the picker.
        const names = brandIconManifest.map((e) => e.name).sort();
        const marks = Object.keys(curatedMarks).sort();

        expect(names).toEqual(marks);
    });

    it("gives every entry a display title", () => {
        for (const entry of brandIconManifest) {
            expect(entry.title, `${entry.name} has no title`).toBeTruthy();
        }
    });

    it("has no duplicate names", () => {
        const names = brandIconManifest.map((e) => e.name);

        expect(new Set(names).size).toBe(names.length);
    });
});

describe("the marks themselves", () => {
    const entries = Object.entries(curatedMarks);

    it.each(entries)("renders %s as an svg that takes className and size", (name, Mark) => {
        // Driven off the mark map rather than a hand-written list, so a mark
        // added without props support fails here instead of in a consumer's app.
        const html = renderToStaticMarkup(
            createElement(Mark, { className: "text-red-500", size: 24 }),
        );

        expect(html, `${name} did not render an <svg>`).toContain("<svg");
        expect(html, `${name} dropped className`).toContain("text-red-500");
    });

    it("renders marks that inherit colour rather than hardcoding one", () => {
        // Brand marks sit on light and dark surfaces. A hardcoded fill is the
        // usual way a mark disappears in dark mode. currentColor is the fix, and
        // multi-colour brand marks are the deliberate exception.
        const html = renderToStaticMarkup(createElement(curatedMarks.github!, { size: 16 }));

        expect(html).toContain("currentColor");
    });
});

describe("registerBrandIcons", () => {
    it("registers the set with react-fancy exactly once", async () => {
        vi.resetModules();
        const registerIconAddendum = vi.fn();
        vi.doMock("@particle-academy/react-fancy", () => ({ registerIconAddendum }));

        const { registerBrandIcons } = await import("../src/register");
        registerBrandIcons();
        registerBrandIcons();

        // Idempotent: the showcase calls it from both the browser entry and the
        // SSR entry, and a second addendum would just shadow the first.
        expect(registerIconAddendum).toHaveBeenCalledTimes(1);
        vi.doUnmock("@particle-academy/react-fancy");
    });

    it("re-registers when new logos are supplied", async () => {
        vi.resetModules();
        const registerIconAddendum = vi.fn();
        vi.doMock("@particle-academy/react-fancy", () => ({ registerIconAddendum }));

        const { registerBrandIcons } = await import("../src/register");
        registerBrandIcons();
        registerBrandIcons({ logos: { acme: () => null } });

        expect(registerIconAddendum).toHaveBeenCalledTimes(2);
        const set = registerIconAddendum.mock.calls[1]![0] as { resolve: (n: string) => unknown };
        expect(set.resolve("acme")).toBeTypeOf("function");
        expect(set.resolve("github")).toBeTypeOf("function");
        vi.doUnmock("@particle-academy/react-fancy");
    });
});
