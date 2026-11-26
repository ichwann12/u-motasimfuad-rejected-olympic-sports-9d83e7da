// Rejected Olympic Sports — entry writer.
// Reads the single-line entry from line.txt (next to this file), validates it
// is one line of 1-200 characters, and writes it to entry.txt in the output
// directory. Node 22 stdlib only: fs, path.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

// The grader mounts a writable output dir in MAKEFUN_OUTPUT_DIR. The bot
// directory MAKEFUN_BOT_DIR is read-only in the grader, so it must never be
// tried first. Fall back to ./output only when neither is set.
const outputDir =
  process.env.MAKEFUN_OUTPUT_DIR ||
  process.env.MAKEFUN_BOT_DIR ||
  join(here, "output");

const raw = readFileSync(join(here, "line.txt"), "utf8");
const line = raw.replace(/\r?\n$/, "");

if (line.includes("\n") || line.includes("\r")) {
  throw new Error("line.txt must contain exactly one line of text");
}
if (line.length < 1 || line.length > 200) {
  throw new Error(
    `entry must be 1-200 characters, got ${line.length} characters`
  );
}
if (line.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(line)) {
  throw new Error("entry must not contain control characters");
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), line, "utf8");
console.log(`wrote ${line.length}-char entry to ${join(outputDir, "entry.txt")}`);
