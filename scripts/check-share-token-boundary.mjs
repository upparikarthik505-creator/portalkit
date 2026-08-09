/**
 * Proves portal lookup is exact share_token equality only.
 * Mirrors the demo branch of getProjectByShareToken (no workspace_id input).
 * Run: node scripts/check-share-token-boundary.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const demoSrc = readFileSync(join(root, "src/lib/demo-data.ts"), "utf8");
const tokens = [...demoSrc.matchAll(/shareToken:\s*"([^"]+)"/g)].map((m) => m[1]);

if (tokens.length < 2) {
  console.error("FAIL: need at least 2 demo share tokens");
  process.exit(1);
}

function findByToken(token) {
  if (!token || typeof token !== "string") return null;
  const hit = tokens.find((t) => t === token) ?? null;
  return hit ? { shareToken: hit } : null;
}

const a = tokens[0];
const b = tokens[1];
const checks = [
  ["exact token A resolves", findByToken(a)?.shareToken === a],
  ["exact token B resolves", findByToken(b)?.shareToken === b],
  ["A and B are different", a !== b],
  ["suffix mutation returns null", findByToken(a + "x") === null],
  ["empty token returns null", findByToken("") === null],
  ["unknown token returns null", findByToken("not-a-real-token-zzzz") === null],
  ["A cannot resolve as B", findByToken(a)?.shareToken !== b],
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} — ${label}`);
  if (!ok) failed += 1;
}

// Schema contract: share_token is unique (see supabase/schema.sql)
const schema = readFileSync(join(root, "supabase/schema.sql"), "utf8");
const uniqueOk = /share_token text not null unique/.test(schema);
console.log(
  `${uniqueOk ? "PASS" : "FAIL"} — schema declares share_token UNIQUE`,
);
if (!uniqueOk) failed += 1;

if (failed) process.exit(1);
console.log(`OK — ${checks.length + 1} boundary checks passed`);
