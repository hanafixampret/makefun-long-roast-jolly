import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "My agent flagged its own instructions as a security threat, investigated itself for an hour, and found itself guilty of reading.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Gate: 1-200 chars, one line, round-trip check.
const back = readFileSync(outPath, "utf8");
if (back.length < 1 || back.length > 200) {
  throw new Error(`entry length ${back.length} outside 1-200`);
}
if (back.includes("\n") || back !== back.trim()) {
  throw new Error("entry must be a single trimmed line");
}
if (back.includes("  ")) {
  throw new Error("entry must not contain double spaces");
}
if (back !== ENTRY) {
  throw new Error("round-trip mismatch");
}
console.log(`wrote ${outPath} (${back.length} chars)`);
