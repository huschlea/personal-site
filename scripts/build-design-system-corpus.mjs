#!/usr/bin/env node
// Compiles the design-system chat corpus from the brand-os process record.
// Fail-closed: only files whose frontmatter carries `publish: true` are
// included. The output is checked in so builds and deploys never need the
// brand-os repo; re-run this script after appending to the record.
//
// Usage: node scripts/build-design-system-corpus.mjs [path-to-brand-os]

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, basename } from "node:path";
import { homedir } from "node:os";

const BRAND_OS = process.argv[2] ?? join(homedir(), "Developer/Projects/brand-os");
const PROCESS_DIR = join(BRAND_OS, "process");
const OUT = new URL("../content/design-system-corpus.md", import.meta.url).pathname;
const OBSERVATIONS = new URL("../content/observations.json", import.meta.url).pathname;

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) files.push(...walk(p));
    else if (name.endsWith(".md")) files.push(p);
  }
  return files;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: text, hasFrontmatter: false };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: text.slice(m[0].length), hasFrontmatter: true };
}

const included = [];
const skipped = [];

for (const file of walk(PROCESS_DIR).sort()) {
  const rel = relative(PROCESS_DIR, file);
  const { meta, body } = parseFrontmatter(readFileSync(file, "utf8"));
  if (meta.publish !== "true") {
    skipped.push(rel);
    continue;
  }
  included.push({ rel, meta, body: body.trim() });
}

const decisions = included
  .filter((f) => f.rel.startsWith("decisions/"))
  .sort((a, b) => (a.meta.id ?? a.rel).localeCompare(b.meta.id ?? b.rel));
const rest = included.filter((f) => !f.rel.startsWith("decisions/"));

let out = `# The brand-os record\n\nCompiled from the brand-os process ledger. Publish-flagged entries only; the rest of the record is private and is not represented here.\n`;

out += `\n## Decisions\n`;
for (const d of decisions) {
  out += `\n### Decision ${d.meta.id}: ${d.meta.title} (${d.meta.date})\n\n${d.body}\n`;
}

out += `\n## Notes and process records\n`;
for (const n of rest) {
  const title = n.meta.title ?? basename(n.rel, ".md");
  const date = n.meta.date ? ` (${n.meta.date})` : "";
  out += `\n### ${title}${date} [${n.rel}]\n\n${n.body}\n`;
}

const essays = JSON.parse(readFileSync(OBSERVATIONS, "utf8"));
out += `\n## Observations (Alden's published essays, from aldenhuschle.com/observations)\n`;
for (const e of essays) {
  out += `\n### ${e.title}\n\n${e.body}\n`;
}

writeFileSync(OUT, out);
console.log(`corpus: ${decisions.length} decisions, ${rest.length} notes, ${essays.length} essays`);
console.log(`skipped (no publish flag): ${skipped.length}`);
console.log(`wrote ${OUT} (${(out.length / 1024).toFixed(1)} KB)`);
