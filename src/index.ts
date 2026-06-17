/**
 * @particle-academy/fancy-brand-icons
 *
 * A brand-icon addendum pack for @particle-academy/react-fancy. Curated CC0
 * brand marks (vendored from Simple Icons, path data inlined — zero runtime
 * deps) registered as an icon addendum so `<Icon name="github" />` resolves
 * the brand mark on top of Lucide. Plus a seam (`src/logos`) for your own
 * app/corp logos.
 */

// One-call registration (the common entry point).
export { registerBrandIcons } from "./register";
export type { RegisterBrandIconsOptions } from "./register";

// The IconSet + manifest + set builder.
export { brandIconSet, makeBrandIconSet, brandIconManifest } from "./brand-set";
export type { BrandIconProps, BrandIconManifestEntry } from "./brand-set";

// The key->component map (curated marks; logos merge in at register-time).
export { curatedMarks } from "./marks";

// Runtime logo seam.
export { logoMarks } from "./logos";

// Tree-shakeable individual mark components — import one without the pack.
export {
  GithubIcon,
  XIcon,
  SlackIcon,
  YoutubeIcon,
  StripeIcon,
  DiscordIcon,
  LinkedinIcon,
  GoogleIcon,
  AppleIcon,
  NpmIcon,
  NodeIcon,
  ReactIcon,
  TypescriptIcon,
  JavascriptIcon,
  TailwindIcon,
  LaravelIcon,
  PhpIcon,
  VercelIcon,
  CloudflareIcon,
  OpenaiIcon,
  AnthropicIcon,
  FigmaIcon,
  NotionIcon,
  GmailIcon,
} from "./marks";
