import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { preload } from "react-dom";
import Site from "./Site";
import "./v2.css";

const HERO_SRCSET =
  "/optimized/home-feature-800.avif 800w, /optimized/home-feature-1600.avif 1600w, /optimized/home-feature-2500.avif 2500w";
const HERO_SIZES = "(max-width: 768px) 100vw, 620px";

// Read the changelog at request time rather than importing it. A static
// `import ... from "changelog.json"` puts the file in the module graph, so every
// append (which happens on every prompt) triggers a dev recompile + Fast Refresh
// reload. Reading it here keeps appends out of the build graph; with no dynamic
// APIs the route is still statically rendered at build for production.
export default async function Page() {
  // Preload the hero AVIF into <head> so the browser starts fetching it during
  // HTML parse — before the JS bundle loads — for the fastest paint. Matches the
  // <picture> AVIF source exactly so the request is reused, not doubled. Scoped
  // to this route (the home page).
  preload("/optimized/home-feature-1600.avif", {
    as: "image",
    type: "image/avif",
    imageSrcSet: HERO_SRCSET,
    imageSizes: HERO_SIZES,
    fetchPriority: "high",
  });

  const changelog: string[] = JSON.parse(
    await readFile(join(process.cwd(), "content", "changelog.json"), "utf8"),
  );
  return <Site changelog={changelog} />;
}
