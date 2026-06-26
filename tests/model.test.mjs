import test from "node:test";
import assert from "node:assert/strict";
import { filterDecisions, normalizeDecision, summary } from "../model.js";
import { seedDecisions } from "../seed.js";

test("filters decisions by search and status", () => {
  const found = filterDecisions(seedDecisions, { query: "checkout", status: "Active" });
  assert.equal(found.length, 1);
  assert.equal(found[0].type, "Technical");
});

test("summarizes active decisions", () => {
  assert.deepEqual(summary(seedDecisions), { total: 4, active: 2, reversible: 1, averageConfidence: 85 });
});

test("normalizes a captured decision", () => {
  const result = normalizeDecision({ title: "  Decide location ", owner: "", context: "A short note", evidence: "Interview", reversible: true, tags: ["strategy", ""] });
  assert.equal(result.title, "Decide location");
  assert.deepEqual(result.tags, ["strategy"]);
  assert.equal(result.owner, "Unassigned");
});
