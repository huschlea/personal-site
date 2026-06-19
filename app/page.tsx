import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Site from "./Site";
import "./v2.css";

// Read the changelog at request time rather than importing it. A static
// `import ... from "changelog.json"` puts the file in the module graph, so every
// append (which happens on every prompt) triggers a dev recompile + Fast Refresh
// reload. Reading it here keeps appends out of the build graph; with no dynamic
// APIs the route is still statically rendered at build for production.
export default async function Page() {
  const changelog: string[] = JSON.parse(
    await readFile(join(process.cwd(), "content", "changelog.json"), "utf8"),
  );
  return <Site changelog={changelog} />;
}
