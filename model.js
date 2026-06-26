export function normalizeDecision(input) {
  return { id: input.id || `d-${Date.now()}`, title: input.title.trim(), owner: input.owner.trim() || "Unassigned", date: input.date || new Date().toISOString().slice(0, 10), type: input.type || "Product", status: input.status || "Active", reversible: Boolean(input.reversible), confidence: Number(input.confidence || 50), context: input.context.trim(), evidence: input.evidence.trim(), tags: (input.tags || []).filter(Boolean) };
}

export function filterDecisions(decisions, { query = "", type = "All", status = "All" } = {}) {
  const term = query.toLowerCase().trim();
  return decisions.filter(decision => (type === "All" || decision.type === type) && (status === "All" || decision.status === status) && (!term || [decision.title, decision.owner, decision.context, ...decision.tags].join(" ").toLowerCase().includes(term)));
}

export function summary(decisions) {
  const active = decisions.filter(item => item.status === "Active");
  return { total: decisions.length, active: active.length, reversible: active.filter(item => item.reversible).length, averageConfidence: active.length ? Math.round(active.reduce((sum, item) => sum + item.confidence, 0) / active.length) : 0 };
}
